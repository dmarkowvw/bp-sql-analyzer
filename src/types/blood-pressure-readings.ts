export type TableHeaders = {
  id: string;
  header: string;
}[]

export type BloodPressure = {
  id: string;
  ts: Date;
  sys: number;
  dia: number;
  puls: number;
};

export type BloodPressureReadings = {
  [key: string]: BloodPressure[];
};
