import { ChangeEvent } from "react";
import { BloodPressureReadings } from "@/types/blood-pressure-readings";
import { nanoid } from "nanoid";

const sortMeasurementDates = (readings: BloodPressureReadings) => {
  return Object.keys(readings)
    .sort((a, b) => b.localeCompare(a))
    .reduce((obj: BloodPressureReadings, key) => {
      obj[key] = readings[key];
      return obj;
    }, {});
};

const sortMeasurements = (readings: BloodPressureReadings) => {
  const keys = Object.keys(readings);
  for (const key of keys) {
    readings[key] = readings[key].sort((a, b) =>
      a.ts.toISOString().localeCompare(b.ts.toISOString())
    );
  }
  return readings;
};

export const readFile = async (
  e: ChangeEvent<HTMLInputElement>,
  setBpData: (data: BloodPressureReadings) => void
) => {
  e.preventDefault();
  const reader = new FileReader();

  reader.onload = async (e) => {
    const data = e.target?.result as string;
    const dataSplit = data.split("\n");

    const re =
      /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{1,3},\d{1,3},\d{1,3})$/;

    const readings: BloodPressureReadings = {};
    for (const row of dataSplit) {
      if (re.test(row.trim())) {
        const [ts, sys, dia, puls] = row.trim().split(",");
        const measurementTs = new Date(ts);
        const measurementDate = measurementTs.toISOString().split("T")[0];

        if (measurementDate in readings) {
          readings[measurementDate].push({
            id: nanoid(),
            ts: measurementTs,
            sys: Number(sys),
            dia: Number(dia),
            puls: Number(puls),
          });
        } else {
          readings[measurementDate] = [
            {
              id: nanoid(),
              ts: measurementTs,
              sys: Number(sys),
              dia: Number(dia),
              puls: Number(puls),
            },
          ];
        }
      }
    }

    setBpData(sortMeasurements(sortMeasurementDates(readings)));
  };
  if (e.target.files) {
    reader.readAsText(e.target.files[0]);
  } else {
    console.error("target.files is null");
  }
};
