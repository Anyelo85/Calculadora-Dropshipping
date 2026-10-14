export interface Product {
  id: number;
  name: string;
  platform: string | null;
  reference: string | null;
  supplierPrice: number;
  createdAt: Date;
}

export interface Calculation {
  id: number;
  productId: number | null;
  productCost: number;
  shippingCost: number;
  dropiCommission: number;
  estimatedCpa: number;
  profitMargin: number;
  orderCount: number;
  totalCost: number;
  idealSalePrice: number;
  idealSalePriceTwoUnits: number;
  idealSalePriceThreeUnits: number;
  profitPerSale: number;
  profitPercentage: number;
  requiredRoas: number;
  totalBilling: number;
  totalProfit: number;
  createdAt: Date;
}

export interface ProductScore {
  id: number;
  productId: number | null;
  wowEffect: boolean;
  catchyLaunch: boolean;
  highValuePerception: boolean;
  needsFulfilled: boolean;
  canImport: boolean;
  score: number;
  maxScore: number;
  createdAt: Date;
}
