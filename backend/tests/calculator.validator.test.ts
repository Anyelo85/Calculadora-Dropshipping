import { describe, expect, it } from 'vitest';
import { calculatorInputSchema } from '../src/validators/calculator.validator';

const validPayload = {
  productCost: 20000,
  shippingCost: 16000,
  supplierPrice: 0,
  profitMargin: 30,
  dropiCommission: 4,
  estimatedCpa: 20500,
  orderCount: 1,
};

describe('calculatorInputSchema', () => {
  it('acepta un payload válido', () => {
    const result = calculatorInputSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  it('aplica los valores por defecto en los campos opcionales', () => {
    const result = calculatorInputSchema.safeParse({
      productCost: 20000,
      shippingCost: 16000,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        productCost: 20000,
        shippingCost: 16000,
        supplierPrice: 0,
        profitMargin: 30,
        dropiCommission: 4,
        estimatedCpa: 0,
        orderCount: 1,
      });
    }
  });

  it('rechaza un payload con campos faltantes', () => {
    const result = calculatorInputSchema.safeParse({ productCost: 20000 });

    expect(result.success).toBe(false);
  });

  it('rechaza un valor negativo', () => {
    const result = calculatorInputSchema.safeParse({ ...validPayload, productCost: -1 });

    expect(result.success).toBe(false);
  });

  it('rechaza una cantidad de pedidos menor a 1', () => {
    const result = calculatorInputSchema.safeParse({ ...validPayload, orderCount: 0 });

    expect(result.success).toBe(false);
  });

  it('rechaza un CPA negativo', () => {
    const result = calculatorInputSchema.safeParse({ ...validPayload, estimatedCpa: -5 });

    expect(result.success).toBe(false);
  });

  it('rechaza un porcentaje fuera de rango', () => {
    const result = calculatorInputSchema.safeParse({ ...validPayload, profitMargin: 1500 });

    expect(result.success).toBe(false);
  });

  it('rechaza un proveedor con valor no numérico', () => {
    const result = calculatorInputSchema.safeParse({ ...validPayload, supplierPrice: 'abc' });

    expect(result.success).toBe(false);
  });

  it('rechaza una entrada vacía', () => {
    const result = calculatorInputSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
