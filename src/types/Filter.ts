import { FilterType, ScoreType } from "./Synopsis";

export type Filter = {
  id: string;
  order: number;
  name: string;
  type: FilterType;
  scoreType: ScoreType | null;
};
