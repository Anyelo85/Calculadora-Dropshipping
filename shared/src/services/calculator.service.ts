import {
  DEFAULT_DROPI_COMMISSION,
  DEFAULT_PROFIT_MARGIN,
  THREE_UNITS_DISCOUNT,
  TWO_UNITS_DISCOUNT,
} from '../constants/calculator.constants';
import type { CalculatorInput, CalculatorResult } from '../types/calculator.types';
import { toNumber } from '../utils/numbers';
import {
  calculateBaseCost,
  calculateBulkPrice,
  calculateDropiCommission,
  calculateIdealSalePrice,
  calculateTotalCost,
} from './pricing.service';
import {
  calculateProfitPercentage,
  calculateProfitPerSale,
  calculateRequiredRoas,
  calculateTotalBilling,
  calculateTotalProfit,
} from './profitability.service';

interface NormalizedCalculatorInput {
  productCost: number;
  shippingCost: number;
  productWeightKg: number;
  shippingCostPerKg: number;
  supplierPrice: number;
  profitMargin: number;
  dropiCommission: number;
  estimatedCpa: number;
  orderCount: number;
}

function normalizeInput(input: CalculatorInput): NormalizedCalculatorInput {
  return {
    productCost: toNumber(input.productCost),
    shippingCost: toNumber(input.shippingCost ?? 0),
    productWeightKg: toNumber(input.productWeightKg ?? 0),
    shippingCostPerKg: toNumber(input.shippingCostPerKg ?? 0),
    supplierPrice: toNumber(input.supplierPrice ?? 0),
    profitMargin: toNumber(input.profitMargin ?? DEFAULT_PROFIT_MARGIN),
    dropiCommission: toNumber(input.dropiCommission ?? DEFAULT_DROPI_COMMISSION),
    estimatedCpa: toNumber(input.estimatedCpa ?? 0),
    orderCount: Math.max(1, Math.floor(toNumber(input.orderCount ?? 1))),
  };
}

export function calculateCalculator(input: CalculatorInput): CalculatorResult {
  const data = normalizeInput(input);

  const baseCost = calculateBaseCost({
    productCost: data.productCost,
    shippingCost: data.shippingCost,
    productWeightKg: data.productWeightKg,
    shippingCostPerKg: data.shippingCostPerKg,
    estimatedCpa: data.estimatedCpa,
    orderCount: data.orderCount,
  });
  const idealSalePrice = calculateIdealSalePrice(
    baseCost,
    data.profitMargin,
    data.dropiCommission,
    data.supplierPrice,
  );
  const dropiCommissionAmount = calculateDropiCommission(idealSalePrice, data.dropiCommission);
  const totalCost = calculateTotalCost(baseCost, dropiCommissionAmount);
  const profitPerSale = calculateProfitPerSale(idealSalePrice, totalCost);

  return {
    totalCost,
    idealSalePrice,
    idealSalePriceTwoUnits: calculateBulkPrice(idealSalePrice, 2, TWO_UNITS_DISCOUNT),
    idealSalePriceThreeUnits: calculateBulkPrice(idealSalePrice, 3, THREE_UNITS_DISCOUNT),
    profitPerSale,
    profitPercentage: calculateProfitPercentage(profitPerSale, idealSalePrice),
    requiredRoas: calculateRequiredRoas(idealSalePrice, data.estimatedCpa),
    totalBilling: calculateTotalBilling(idealSalePrice, data.orderCount),
    totalProfit: calculateTotalProfit(profitPerSale, data.orderCount),
  };
}
