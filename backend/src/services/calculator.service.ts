import { calculateCalculator, calculateProductScore } from '@calculadora/shared';
import type {
  CalculatorInput,
  CalculatorResult,
  ProductScoreInput,
  ProductScoreResult,
} from '@calculadora/shared';

export function calculate(input: CalculatorInput): CalculatorResult {
  return calculateCalculator(input);
}

export function scoreProduct(input: ProductScoreInput): ProductScoreResult {
  return calculateProductScore(input);
}
