<script setup lang="ts">
import type { CalculatorInput } from '@calculadora/shared';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import CalculatorForm from '../components/CalculatorForm.vue';
import ResultCards from '../components/ResultCards.vue';
import { useCalculatorStore } from '../stores/calculator.store';

const store = useCalculatorStore();
const { result, loading, error, fieldErrors } = storeToRefs(store);
const lastInput = ref<CalculatorInput | null>(null);

const errorDetails = computed(() => Object.values(fieldErrors.value).flat());

function onCalculate(input: CalculatorInput): void {
  lastInput.value = input;
  void store.calculate(input);
}
</script>

<template>
  <main class="view">
    <header class="hero">
      <h1>Calculadora Dropshipping</h1>
      <p class="subtitle">Analiza costo, margen, precio ideal y ROAS por pedido</p>
    </header>

    <div class="layout">
      <CalculatorForm @submit="onCalculate" />

      <section class="panel">
        <div v-if="loading" class="state">
          <p class="status">Calculando…</p>
        </div>
        <div v-else-if="error" class="state panel-error">
          <p class="status error">{{ error }}</p>
          <ul v-if="errorDetails.length" class="error-details">
            <li v-for="(detail, index) in errorDetails" :key="index">{{ detail }}</li>
          </ul>
        </div>
        <ResultCards v-else-if="result && lastInput" :result="result" :input="lastInput" />
        <div v-else class="state empty">
          <p class="status">Ingresa los datos y presiona Calcular.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero {
  flex: 0 0 auto;
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f1f5f9;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--text-muted);
}

.layout {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: 440px 1fr;
  gap: 20px;
}

.panel {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  scrollbar-width: none;
}

.panel::-webkit-scrollbar {
  display: none;
}

.state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-align: center;
}

.empty {
  background: var(--surface);
}

.panel-error {
  border-color: rgba(248, 113, 113, 0.35);
}

.status {
  margin: 0;
  color: var(--text-muted);
  font-size: 15px;
}

.error {
  color: var(--danger);
  font-weight: 600;
}

.error-details {
  margin: 12px 0 0;
  padding-left: 20px;
  color: var(--danger);
  font-size: 14px;
  text-align: left;
}

@media (max-width: 900px), (max-height: 660px) {
  .view {
    height: auto;
  }

  .layout {
    grid-template-columns: 1fr;
  }

  .state {
    height: auto;
    min-height: 200px;
  }

  .panel {
    overflow: visible;
  }
}
</style>
