import type { ProductScoreInput, ProductScoreResult } from '../types/product-score.types';

export function calculateProductScore(input: ProductScoreInput): ProductScoreResult {
  const criteria = [
    input.wowEffect,
    input.catchyLaunch,
    input.highValuePerception,
    input.needsFulfilled,
    input.canImport,
  ];

  return {
    score: criteria.filter(Boolean).length,
    maxScore: criteria.length,
  };
}
