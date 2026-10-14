import type { Request, Response } from 'express';
import { calculate, scoreProduct } from '../services/calculator.service';
import { calculatorInputSchema, productScoreSchema } from '../validators/calculator.validator';

function validationErrorResponse(res: Response, error: { fieldErrors: Record<string, string[]> }): void {
  res.status(400).json({
    message: 'La solicitud contiene datos inválidos',
    errors: error.fieldErrors,
  });
}

export function postCalculate(req: Request, res: Response): void {
  const parsed = calculatorInputSchema.safeParse(req.body);

  if (!parsed.success) {
    validationErrorResponse(res, parsed.error.flatten());
    return;
  }

  res.json(calculate(parsed.data));
}

export function postProductScore(req: Request, res: Response): void {
  const parsed = productScoreSchema.safeParse(req.body);

  if (!parsed.success) {
    validationErrorResponse(res, parsed.error.flatten());
    return;
  }

  res.json(scoreProduct(parsed.data));
}
