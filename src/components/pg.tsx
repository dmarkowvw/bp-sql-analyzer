"use client";
import { PGlite, types } from "@electric-sql/pglite";
import { useEffect, useState } from "react";

export default function ClientDb() {
  const [qryRes, setQryRes] = useState<unknown>();

  useEffect(() => {
    (async () => {
      const db = new PGlite();
      const time = await db.query("select * from now();", [], {
        rowMode: "object",
        // parsers: {
        //   [types.TEXT]: (value) => value.toUpperCase(),
        // },
      });
      setQryRes(time);
      await db.close();
    })();
  }, []);

  return (
    <div>
      <h1>query result:</h1>
      <p>{JSON.stringify(qryRes)}</p>
    </div>
  );
}
