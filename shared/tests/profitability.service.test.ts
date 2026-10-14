import { describe, expect, it } from 'vitest';
import {
  calculateProfitPercentage,
  calculateProfitPerSale,
  calculateRequiredRoas,
  calculateTotalBilling,
  calculateTotalProfit,
} from '../src/services/profitability.service';

describe('calculateProfitPerSale', () => {
  it('resta el costo total al precio de venta', () => {
    expect(calculateProfitPerSale(1300, 1000)).toBe(300);
  });
});

describe('calculateProfitPercentage', () => {
  it('calcula el margen sobre el precio de venta', () => {
    expect(calculateProfitPercentage(300, 1300)).toBe(23.08);
  });

  it('devuelve 0 si el precio de venta no es positivo', () => {
    expect(calculateProfitPercentage(300, 0)).toBe(0);
  });
});

describe('calculateRequiredRoas', () => {
  it('divide el precio de venta entre el CPA', () => {
    expect(calculateRequiredRoas(1300, 20500)).toBe(0.06);
  });

  it('devuelve 0 si el CPA no es positivo', () => {
    expect(calculateRequiredRoas(1300, 0)).toBe(0);
  });
});

describe('calculateTotalBilling', () => {
  it('multiplica el precio de venta por la cantidad de pedidos', () => {
    expect(calculateTotalBilling(1300, 3)).toBe(3900);
  });
});

describe('calculateTotalProfit', () => {
  it('multiplica la ganancia por venta por la cantidad de pedidos', () => {
    expect(calculateTotalProfit(300, 3)).toBe(900);
  });
});
