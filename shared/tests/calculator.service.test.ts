import { describe, expect, it } from 'vitest';
import { THREE_UNITS_DISCOUNT, TWO_UNITS_DISCOUNT } from '../src/constants/calculator.constants';
import { calculateCalculator } from '../src/services/calculator.service';
import { calculateBulkPrice, calculateDropiCommission } from '../src/services/pricing.service';

describe('calculateCalculator', () => {
  it('aplica los valores por defecto del negocio', () => {
    const result = calculateCalculator({ productCost: 20000, shippingCost: 16000 });

    expect(result).toEqual({
      totalCost: 38502.67,
      idealSalePrice: 50053.48,
      idealSalePriceTwoUnits: 80085.57,
      idealSalePriceThreeUnits: 105112.31,
      profitPerSale: 11550.81,
      profitPercentage: 23.08,
      requiredRoas: 0,
      totalBilling: 50053.48,
      totalProfit: 11550.81,
    });
  });

  it('cobra la comisión DROPI como porcentaje del precio de venta', () => {
    const result = calculateCalculator({
      productCost: 62000,
      shippingCost: 22000,
      estimatedCpa: 0,
      profitMargin: 30,
      dropiCommission: 5,
    });

    expect(result.idealSalePrice).toBe(116791.44);
    expect(result.totalCost).toBe(89839.57);
    expect(result.profitPerSale).toBe(26951.87);
    expect(result.profitPercentage).toBe(23.08);
  });

  it('mantén la utilidad objetivo con el 25% de margen y 5% de comisión', () => {
    const result = calculateCalculator({
      productCost: 62000,
      shippingCost: 22000,
      estimatedCpa: 0,
      profitMargin: 25,
      dropiCommission: 5,
    });

    expect(result.idealSalePrice).toBe(112000);
    expect(result.totalCost).toBe(89600);
    expect(result.profitPerSale).toBe(22400);
  });

  it('regresión: el 5% de comisión nunca se trata como 5 pesos fijos', () => {
    const result = calculateCalculator({
      productCost: 62500,
      shippingCost: 22000,
      supplierPrice: 0,
      productWeightKg: 0,
      shippingCostPerKg: 0,
      dropiCommission: 5,
      profitMargin: 25,
      estimatedCpa: 0,
      orderCount: 1,
    });

    const commissionInPesos = calculateDropiCommission(result.idealSalePrice, 5);

    expect(result.idealSalePrice).toBe(112666.67);
    expect(result.totalBilling).toBe(112666.67);
    expect(commissionInPesos).toBe(5633.33);
    expect(commissionInPesos).not.toBe(5);
    expect(result.totalCost).toBe(90133.33);
    expect(result.profitPerSale).toBe(22533.34);

    const twoUnitsPrice = calculateBulkPrice(result.idealSalePrice, 2, TWO_UNITS_DISCOUNT);
    const threeUnitsPrice = calculateBulkPrice(result.idealSalePrice, 3, THREE_UNITS_DISCOUNT);

    expect(calculateDropiCommission(twoUnitsPrice, 5)).toBe(9013.33);
    expect(calculateDropiCommission(threeUnitsPrice, 5)).toBe(11830);
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
