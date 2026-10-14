import type {
  CalculatorInput,
  CalculatorResult,
  ProductScoreInput,
  ProductScoreResult,
} from '@calculadora/shared';

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

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  if (!response.ok) {
    const errorBody = (await safeJson<ApiErrorBody>(response)) ?? {};
    throw new ApiError(
      errorBody.message ?? 'La solicitud no es válida',
      response.status,
      errorBody.errors ?? {},
    );
  }

  return (await response.json()) as T;
}

export function calculateRemote(input: CalculatorInput): Promise<CalculatorResult> {
  return post<CalculatorResult>('/api/calculator', input);
}

export function scoreProductRemote(input: ProductScoreInput): Promise<ProductScoreResult> {
  return post<ProductScoreResult>('/api/calculator/score', input);
}
