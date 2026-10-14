import type {
  CalculatorInput,
  CalculatorResult,
  ProductScoreInput,
  ProductScoreResult,
} from '@calculadora/shared';
import { calculateCalculator, calculateProductScore } from '@calculadora/shared';
import {
  calculatorInputSchema,
  productScoreInputSchema,
  validationFieldErrors,
} from './calculator.validation';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true' && Boolean(API_URL);

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function validateInput<T>(
  result: ReturnType<typeof calculatorInputSchema.safeParse> | ReturnType<typeof productScoreInputSchema.safeParse>,
): T {
  if (!result.success) {
    throw new ApiError(
      'La solicitud contiene datos inválidos',
      400,
      validationFieldErrors(result.error),
    );
  }

  return result.data as T;
}

async function post<T>(path: string, body: unknown, fallback: () => T): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return fallback();
  }

  const isJson = response.headers.get('content-type')?.includes('json') ?? false;

  if (response.status === 404 || response.status === 405 || !isJson) {
    return fallback();
  }

  if (!response.ok) {
    const errorBody = (await safeJson<ApiErrorBody>(response)) ?? {};
    throw new ApiError(
      errorBody.message ?? 'La solicitud contiene datos inválidos',
      response.status,
      errorBody.errors ?? {},
    );
  }

  const data = await safeJson<T>(response);

  return data === null ? fallback() : data;
}

export function calculateRemote(input: CalculatorInput): Promise<CalculatorResult> {
  const validatedInput = validateInput<CalculatorInput>(calculatorInputSchema.safeParse(input));
  const fallback = () => calculateCalculator(validatedInput);

  if (!USE_BACKEND) {
    return Promise.resolve(fallback());
  }

  return post('/api/calculator', validatedInput, fallback);
}

export function scoreProductRemote(input: ProductScoreInput): Promise<ProductScoreResult> {
  const validatedInput = validateInput<ProductScoreInput>(productScoreInputSchema.safeParse(input));
  const fallback = () => calculateProductScore(validatedInput);

  if (!USE_BACKEND) {
    return Promise.resolve(fallback());
  }

  return post('/api/calculator/score', validatedInput, fallback);
}
