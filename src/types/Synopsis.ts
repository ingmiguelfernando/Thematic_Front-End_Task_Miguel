export type Synopsis = SampleProps & {
  colType: "Text" | "Number" | "Date";
  numRows: number;
  numUniqueValues: number;
};

export interface SampleProps {
  sample: Array<string>;
  sampleHeader: string;
}

export type FilterType = "Default" | "Date" | "Search" | "Score";

export type ScoreType = "Average" | "NPS" | "Threshold";
