export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrency(value: number, currency = 'COL'): string {
  return `${formatNumber(value)} ${currency}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
