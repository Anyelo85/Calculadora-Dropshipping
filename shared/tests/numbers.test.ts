import { describe, expect, it } from 'vitest';
import { round2, toNumber } from '../src/utils/numbers';

describe('round2', () => {
  it('redondea a dos decimales', () => {
    expect(round2(23.076923)).toBe(23.08);
  });
});

describe('toNumber', () => {
  it('convierte cadenas numéricas a número', () => {
    expect(toNumber('42.5')).toBe(42.5);
  });

  it('usa el valor por defecto ante entradas inválidas', () => {
    expect(toNumber('abc', 7)).toBe(7);
    expect(toNumber(undefined, 3)).toBe(3);
  });
});
