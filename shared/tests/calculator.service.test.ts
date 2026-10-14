import { describe, expect, it } from 'vitest';
import { calculateCalculator } from '../src/services/calculator.service';

describe('calculateCalculator', () => {
  it('aplica los valores por defecto del negocio', () => {
    const result = calculateCalculator({ productCost: 20000, shippingCost: 16000 });

    expect(result).toEqual({
      totalCost: 36004,
      idealSalePrice: 46805.2,
      idealSalePriceTwoUnits: 74888.32,
      idealSalePriceThreeUnits: 98290.92,
      profitPerSale: 10801.2,
      profitPercentage: 23.08,
      requiredRoas: 0,
      totalBilling: 46805.2,
      totalProfit: 10801.2,
    });
  });

  it('respeta el precio del proveedor si supera el precio calculado', () => {
    const result = calculateCalculator({
      productCost: 1000,
      shippingCost: 0,
      supplierPrice: 5000,
      profitMargin: 0,
      dropiCommission: 0,
      estimatedCpa: 0,
    });

    expect(result.idealSalePrice).toBe(5000);
    expect(result.profitPerSale).toBe(4000);
  });

  it('multiplica facturación y ganancia por la cantidad de pedidos', () => {
    const result = calculateCalculator({
      productCost: 1000,
      shippingCost: 0,
      profitMargin: 50,
      dropiCommission: 0,
      estimatedCpa: 0,
      orderCount: 4,
    });

    expect(result.idealSalePrice).toBe(1500);
    expect(result.totalBilling).toBe(6000);
    expect(result.totalProfit).toBe(2000);
  });

  it('calcula el ROAS cuando hay CPA estimado', () => {
    const result = calculateCalculator({
      productCost: 1000,
      shippingCost: 0,
      profitMargin: 30,
      dropiCommission: 0,
      estimatedCpa: 500,
    });

    expect(result.idealSalePrice).toBe(1950);
    expect(result.requiredRoas).toBe(3.9);
  });

  it('normaliza la cantidad de pedidos a un mínimo de 1', () => {
    const result = calculateCalculator({
      productCost: 1000,
      shippingCost: 0,
      dropiCommission: 0,
      estimatedCpa: 0,
      orderCount: 0,
    });

    expect(result.totalBilling).toBe(result.idealSalePrice);
    expect(result.totalProfit).toBe(result.profitPerSale);
  });
});
