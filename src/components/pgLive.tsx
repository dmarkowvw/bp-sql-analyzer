"use client";

import { PGlite, type Results } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { useEffect, useState } from "react";

export default function LiveClientDb() {
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
      <input
        type="text"
        value={qry}
        onChange={(e) => setQry(e.target.value)}
        className="border border-slate-300 rounded-md p-1"
      />
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
    </div>
  );
}
