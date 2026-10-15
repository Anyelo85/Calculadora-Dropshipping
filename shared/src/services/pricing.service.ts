import { round2 } from '../utils/numbers';

export interface PricingCostInput {
  productCost: number;
  shippingCost?: number;
  productWeightKg?: number;
  shippingCostPerKg?: number;
  estimatedCpa?: number;
  orderCount?: number;
}

export function calculateBaseCost(input: PricingCostInput): number {
  const fixedShipping = input.shippingCost ?? 0;
  const perKgShipping = input.shippingCostPerKg ?? 0;
  const totalWeight = (input.productWeightKg ?? 0) * Math.max(1, Math.floor(input.orderCount ?? 1));
  const weightShipping = totalWeight * perKgShipping;

  return round2(
    input.productCost + fixedShipping + weightShipping + (input.estimatedCpa ?? 0),
  );
}

export function calculateIdealSalePrice(
  baseCost: number,
  profitMargin: number,
  dropiCommission: number,
  supplierPrice: number,
): number {
  const margin = profitMargin / 100;
  const commissionRate = dropiCommission / 100;
  const divisor = 1 - commissionRate * (1 + margin);
  const price = divisor > 0 ? (baseCost * (1 + margin)) / divisor : baseCost * (1 + margin);
  return round2(Math.max(price, supplierPrice));
}

export function calculateDropiCommission(salePrice: number, dropiCommission: number): number {
  return round2(salePrice * (dropiCommission / 100));
}

export function calculateTotalCost(baseCost: number, dropiCommissionAmount: number): number {
  return round2(baseCost + dropiCommissionAmount);
}

export function calculateBulkPrice(unitPrice: number, units: number, discount: number): number {
  return round2(unitPrice * units * (1 - discount));
}
