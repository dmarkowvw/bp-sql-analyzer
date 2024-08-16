"use client";

import { BloodPressureReadings } from "@/types/blood-pressure-readings";
import { readFile } from "@/utils/readFile";
import { PGlite, type Results } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { useEffect, useState } from "react";

export default function LiveClientDb() {
  const [bpData, setBpData] = useState<BloodPressureReadings>();
  const [db, setDb] = useState<PGlite>();
  const [qry, setQry] = useState<string>("");
  const [qryState, setQryState] = useState<"DONE" | "PENDING">();
  const [qryRes, setQryRes] = useState<Results>();

  // set up db
  useEffect(() => {
    (async () => {
      console.log("init live db");
      const pg = await PGlite.create({
        extensions: {
          live,
        },
      });
      setDb(pg);
    })();
  }, []);

  useEffect(() => {
    if (db?.ready) {
      console.log("creating table");
      (async () => {
        await db.query(`CREATE TABLE IF NOT EXISTS bloodpressure (
        id VARCHAR(21),
        ts TIMESTAMP,
        sys INTEGER,
        dia INTEGER,
        puls INTEGER
      );`);
        for (const k in bpData) {
          for (const measurement of bpData[k]) {
            await db.query(
              "INSERT INTO bloodpressure VALUES ($1, $2, $3, $4, $5)",
              Object.values(measurement)
            );
          }
        }
      })();
    }
  }, [bpData]);

  useEffect(() => {
    if (qryState == "PENDING") {
      console.log("executing live query");
      // @ts-ignore
      db.live.query(qry, [], (res: Results) => {
        setQryRes(res);
        setQryState("DONE");
      });
      // in case of error
      setQryState("DONE");
    }
  }, [qryState]);

  return (
    <div>
      <div className="flex flex-col gap-y-2">
        <div className="flex w-1/4 flex-col gap-y-1">
          <label htmlFor="bp-readings" className="block text-sm">
            Datei Upload
          </label>
          <input
            type="file"
            id="bp-readings"
            name="bp-file-upload"
            accept=".csv"
            onChange={(e) => readFile(e, setBpData)}
            className="file:cursor-pointer file:rounded-lg file:border-slate-700 file:bg-slate-100 file:hover:bg-slate-200"
          />
        </div>
        <div className="flex w-1/4 flex-col gap-y-1">
          <label htmlFor="query" className="block text-sm">
            Query
          </label>
          <input
            id="query"
            type="text"
            value={qry}
            onChange={(e) => setQry(e.target.value)}
            className="border border-slate-300 rounded-md p-1"
          />
        </div>
      </div>
      <div className="h-4" />
      <button
        type="button"
        onClick={() => setQryState("PENDING")}
        disabled={qryState === "PENDING"}
        className="border border-slate-400 px-5 py-1 hover:bg-slate-100 rounded-md disabled:bg-red-300"
      >
        Run
      </button>
      <p>{JSON.stringify(qryRes)}</p>
      {/* <p>{JSON.stringify(bpData)}</p> */}
    </div>
  );
}
