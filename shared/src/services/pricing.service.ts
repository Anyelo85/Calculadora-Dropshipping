import { round2 } from '../utils/numbers';

export interface PricingCostInput {
  productCost: number;
  shippingCost?: number;
  productWeightKg?: number;
  shippingCostPerKg?: number;
  dropiCommission?: number;
  estimatedCpa?: number;
  orderCount?: number;
}

export function calculateTotalCost(input: PricingCostInput): number {
  const fixedShipping = input.shippingCost ?? 0;
  const perKgShipping = input.shippingCostPerKg ?? 0;
  const totalWeight = (input.productWeightKg ?? 0) * Math.max(1, Math.floor(input.orderCount ?? 1));
  const weightShipping = totalWeight * perKgShipping;

  return round2(
    (input.dropiCommission ?? 0) +
      input.productCost +
      fixedShipping +
      weightShipping +
      (input.estimatedCpa ?? 0),
  );
}

export function calculateIdealSalePrice(
  totalCost: number,
  profitMargin: number,
  supplierPrice: number,
): number {
  const margin = profitMargin / 100;
  const price = totalCost + totalCost * margin;
  return round2(Math.max(price, supplierPrice));
}

export function calculateBulkPrice(unitPrice: number, units: number, discount: number): number {
  return round2(unitPrice * units * (1 - discount));
}
