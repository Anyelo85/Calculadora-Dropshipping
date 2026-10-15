import { z } from 'zod';

export const calculatorInputSchema = z.object({
  productCost: z
    .number({
      required_error: 'El valor del producto es obligatorio',
      invalid_type_error: 'El valor del producto debe ser un número',
    })
    .nonnegative('El valor del producto no puede ser negativo'),
  shippingCost: z
    .number({ invalid_type_error: 'El valor del envío debe ser un número' })
    .nonnegative('El valor del envío no puede ser negativo')
    .optional()
    .default(0),
  productWeightKg: z
    .number({ invalid_type_error: 'El peso del producto debe ser un número' })
    .nonnegative('El peso del producto no puede ser negativo')
    .optional()
    .default(0),
  shippingCostPerKg: z
    .number({ invalid_type_error: 'El costo por kg debe ser un número' })
    .nonnegative('El costo por kg no puede ser negativo')
    .optional()
    .default(0),
  supplierPrice: z
    .number({ invalid_type_error: 'El precio del proveedor debe ser un número' })
    .nonnegative('El precio del proveedor no puede ser negativo')
    .optional()
    .default(0),
  profitMargin: z
    .number({ invalid_type_error: 'El porcentaje de utilidad debe ser un número' })
    .min(0, 'El porcentaje de utilidad no puede ser negativo')
    .max(1000, 'El porcentaje de utilidad es demasiado alto')
    .optional()
    .default(30),
  dropiCommission: z
    .number({ invalid_type_error: 'La comisión DROPI debe ser un número' })
    .min(0, 'La comisión DROPI no puede ser negativa')
    .max(100, 'La comisión DROPI no puede superar el 100%')
    .optional()
    .default(5),
  estimatedCpa: z
    .number({ invalid_type_error: 'El CPA debe ser un número' })
    .nonnegative('El CPA no puede ser negativo')
    .optional()
    .default(0),
  orderCount: z
    .number({ invalid_type_error: 'La cantidad de pedidos debe ser un número' })
    .int('La cantidad de pedidos debe ser un entero')
    .positive('La cantidad de pedidos debe ser al menos 1')
    .optional()
    .default(1),
});

export const productScoreInputSchema = z.object({
  wowEffect: z.boolean({ invalid_type_error: 'El efecto wow debe ser verdadero o falso' }),
  catchyLaunch: z.boolean({ invalid_type_error: 'El lanzamiento debe ser verdadero o falso' }),
  highValuePerception: z.boolean({
    invalid_type_error: 'La percepción de valor debe ser verdadero o falso',
  }),
  needsFulfilled: z.boolean({ invalid_type_error: 'La necesidad debe ser verdadero o falso' }),
  canImport: z.boolean({ invalid_type_error: 'La importación debe ser verdadero o falso' }),
});

export function validationFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join('.') || '_form';
    (fieldErrors[field] ??= []).push(issue.message);
  }

  return fieldErrors;
}