import type {
  CalculatorInput,
  CalculatorResult,
  ProductScoreInput,
  ProductScoreResult,
} from '@calculadora/shared';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ApiError, calculateRemote, scoreProductRemote } from '../services/calculator.api';

export const useCalculatorStore = defineStore('calculator', () => {
  const result = ref<CalculatorResult | null>(null);
  const score = ref<ProductScoreResult | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const fieldErrors = ref<Record<string, string[]>>({});

  function handleError(caught: unknown): void {
    if (caught instanceof ApiError) {
      error.value = caught.message;
      fieldErrors.value = caught.fieldErrors;
      return;
    }

    error.value = caught instanceof Error ? caught.message : 'Error desconocido';
    fieldErrors.value = {};
  }

  function resetError(): void {
    error.value = null;
    fieldErrors.value = {};
  }

  async function calculate(input: CalculatorInput): Promise<void> {
    loading.value = true;
    resetError();

    try {
      result.value = await calculateRemote(input);
    } catch (caught) {
      handleError(caught);
    } finally {
      loading.value = false;
    }
  }

  async function evaluateProduct(input: ProductScoreInput): Promise<void> {
    loading.value = true;
    resetError();

    try {
      score.value = await scoreProductRemote(input);
    } catch (caught) {
      handleError(caught);
    } finally {
      loading.value = false;
    }
  }

  return { result, score, loading, error, fieldErrors, calculate, evaluateProduct };
});
