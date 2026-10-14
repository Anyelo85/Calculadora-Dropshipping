import { describe, expect, it } from 'vitest';
import { calculateProductScore } from '../src/services/product-score.service';

describe('calculateProductScore', () => {
  it('puntúa 5/5 cuando cumple todos los criterios', () => {
    const result = calculateProductScore({
      wowEffect: true,
      catchyLaunch: true,
      highValuePerception: true,
      needsFulfilled: true,
      canImport: true,
    });

    expect(result).toEqual({ score: 5, maxScore: 5 });
  });

  it('cuenta solo los criterios cumplidos', () => {
    const result = calculateProductScore({
      wowEffect: true,
      catchyLaunch: false,
      highValuePerception: true,
      needsFulfilled: false,
      canImport: true,
    });

    expect(result).toEqual({ score: 3, maxScore: 5 });
  });

  it('puntúa 0 cuando no cumple ningún criterio', () => {
    const result = calculateProductScore({
      wowEffect: false,
      catchyLaunch: false,
      highValuePerception: false,
      needsFulfilled: false,
      canImport: false,
    });

    expect(result).toEqual({ score: 0, maxScore: 5 });
  });
});
