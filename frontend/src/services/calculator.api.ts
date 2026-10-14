import type {
  CalculatorInput,
  CalculatorResult,
  ProductScoreInput,
  ProductScoreResult,
} from '@calculadora/shared';
import { calculateCalculator, calculateProductScore } from '@calculadora/shared';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

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

function isUnavailable(status: number): boolean {
  return status === 0 || status === 404;
}

async function post<T>(path: string, body: unknown, fallback: () => T): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return fallback();
  }

  if (!response.ok) {
    if (isUnavailable(response.status)) {
      return fallback();
    }

    const errorBody = (await safeJson<ApiErrorBody>(response)) ?? {};
    throw new ApiError(
      errorBody.message ?? 'La solicitud no es válida',
      response.status,
      errorBody.errors ?? {},
    );
  }

  const data = await safeJson<T>(response);

  return data === null ? fallback() : data;
}

export function calculateRemote(input: CalculatorInput): Promise<CalculatorResult> {
  return post('/api/calculator', input, () => calculateCalculator(input));
}

export function scoreProductRemote(input: ProductScoreInput): Promise<ProductScoreResult> {
  return post('/api/calculator/score', input, () => calculateProductScore(input));
}
