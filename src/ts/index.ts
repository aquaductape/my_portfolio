export type WakaData = [string, string, number];

export type WakaSchema = [
  {
    name: "Project";
    type: "string";
  },
  {
    name: "Time";
    type: "date";
    format: "%-m/%-d/%Y";
  },
  {
    name: "Total";
    type: "number";
  }
];
