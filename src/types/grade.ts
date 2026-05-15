export type LimitingSubgrade = 'centrage' | 'coins' | 'tranches' | 'surface';

export interface GradeResponse {
  centering_horizontal_pct: number;
  centering_vertical_pct: number;
  corners_score: number;
  edges_score: number;
  surface_score: number;
  psa10_likelihood: number;
  limiting_subgrade: LimitingSubgrade;
  reasoning_fr: string;
}
