import { describe, expect, it } from 'vitest';
import {
  calculateBulkPrice,
  calculateIdealSalePrice,
  calculateTotalCost,
} from '../src/services/pricing.service';

describe('calculateTotalCost', () => {
  it('suma comisión, producto, envío y CPA', () => {
    const result = calculateTotalCost({
      productCost: 20000,
      shippingCost: 16000,
      dropiCommission: 4,
      estimatedCpa: 20500,
    });

    expect(result).toBe(56504);
  });

  it('calcula el envío por peso cuando el transportista cobra por kg', () => {
    const result = calculateTotalCost({
      productCost: 20000,
      shippingCost: 0,
      productWeightKg: 20,
      shippingCostPerKg: 25000,
      dropiCommission: 0,
      estimatedCpa: 0,
      orderCount: 1,
    });

    expect(result).toBe(520000);
  });
});

describe('calculateIdealSalePrice', () => {
  it('aplica el margen sobre el costo total', () => {
    expect(calculateIdealSalePrice(1000, 30, 0)).toBe(1300);
  });

  it('respeta el precio del proveedor como piso', () => {
    expect(calculateIdealSalePrice(1000, 30, 5000)).toBe(5000);
  });

  it('con margen 0 devuelve el costo total', () => {
    expect(calculateIdealSalePrice(1000, 0, 0)).toBe(1000);
  });
});

describe('calculateBulkPrice', () => {
  it('aplica descuento por 2 unidades', () => {
    expect(calculateBulkPrice(1000, 2, 0.2)).toBe(1600);
  });

  it('aplica descuento por 3 unidades', () => {
    expect(calculateBulkPrice(1000, 3, 0.3)).toBe(2100);
  });
});
