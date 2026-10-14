export interface CalculatorInput {
  productCost: number;
  shippingCost?: number;
  productWeightKg?: number;
  shippingCostPerKg?: number;
  supplierPrice?: number;
  profitMargin?: number;
  dropiCommission?: number;
  estimatedCpa?: number;
  orderCount?: number;
}

export interface CalculatorResult {
  totalCost: number;
  idealSalePrice: number;
  idealSalePriceTwoUnits: number;
  idealSalePriceThreeUnits: number;
  profitPerSale: number;
  profitPercentage: number;
  requiredRoas: number;
  totalBilling: number;
  totalProfit: number;
}
