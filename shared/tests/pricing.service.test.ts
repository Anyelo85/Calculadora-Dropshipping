import { describe, expect, it } from 'vitest';
import {
  calculateBaseCost,
  calculateBulkPrice,
  calculateDropiCommission,
  calculateIdealSalePrice,
  calculateTotalCost,
} from '../src/services/pricing.service';

describe('calculateBaseCost', () => {
  it('suma producto, envío y CPA sin la comisión', () => {
    const result = calculateBaseCost({
      productCost: 20000,
      shippingCost: 16000,
      estimatedCpa: 20500,
    });

    expect(result).toBe(56500);
  });

  it('calcula el envío por peso cuando el transportista cobra por kg', () => {
    const result = calculateBaseCost({
      productCost: 20000,
      shippingCost: 0,
      productWeightKg: 20,
      shippingCostPerKg: 25000,
      estimatedCpa: 0,
      orderCount: 1,
    });

    expect(result).toBe(520000);
  });
});

describe('calculateIdealSalePrice', () => {
  it('invierte la comisión para mantener la utilidad sobre el costo', () => {
    expect(calculateIdealSalePrice(84000, 30, 5, 0)).toBe(116791.44);
  });

  it('con comisión 0 aplica sólo el margen', () => {
    expect(calculateIdealSalePrice(1000, 30, 0, 0)).toBe(1300);
  });

  it('respeta el precio del proveedor como piso', () => {
    expect(calculateIdealSalePrice(1000, 30, 0, 5000)).toBe(5000);
  });

  it('con margen 0 devuelve el costo más la comisión', () => {
    expect(calculateIdealSalePrice(1000, 0, 0, 0)).toBe(1000);
  });
});

describe('calculateDropiCommission', () => {
  it('cobra el porcentaje sobre el precio de venta', () => {
    expect(calculateDropiCommission(116791.44, 5)).toBe(5839.57);
  });

  it('con comisión 0 no cobra nada', () => {
    expect(calculateDropiCommission(1000, 0)).toBe(0);
  });
});

describe('calculateTotalCost', () => {
  it('suma el costo base y la comisión en pesos', () => {
    expect(calculateTotalCost(84000, 5839.57)).toBe(89839.57);
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
