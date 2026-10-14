import { round2 } from '../utils/numbers';

export function calculateProfitPerSale(salePrice: number, totalCost: number): number {
  return round2(salePrice - totalCost);
}

export function calculateProfitPercentage(profit: number, salePrice: number): number {
  if (salePrice <= 0) {
    return 0;
  }
  return round2((profit / salePrice) * 100);
}

export function calculateRequiredRoas(salePrice: number, estimatedCpa: number): number {
  if (estimatedCpa <= 0) {
    return 0;
  }
  return round2(salePrice / estimatedCpa);
}

export function calculateTotalBilling(salePrice: number, orderCount: number): number {
  return round2(salePrice * orderCount);
}

export function calculateTotalProfit(profitPerSale: number, orderCount: number): number {
  return round2(profitPerSale * orderCount);
}
