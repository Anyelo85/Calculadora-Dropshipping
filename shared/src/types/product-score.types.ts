export interface ProductScoreInput {
  wowEffect: boolean;
  catchyLaunch: boolean;
  highValuePerception: boolean;
  needsFulfilled: boolean;
  canImport: boolean;
}

export interface ProductScoreResult {
  score: number;
  maxScore: number;
}
