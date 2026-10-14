export function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
