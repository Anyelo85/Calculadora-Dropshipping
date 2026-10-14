import type { Request, Response } from 'express';
import { calculate, scoreProduct } from '../services/calculator.service';
import { calculatorInputSchema, productScoreSchema } from '../validators/calculator.validator';

export function postCalculate(req: Request, res: Response): void {
  const parsed = calculatorInputSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  res.json(calculate(parsed.data));
}

export function postProductScore(req: Request, res: Response): void {
  const parsed = productScoreSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  res.json(scoreProduct(parsed.data));
}
