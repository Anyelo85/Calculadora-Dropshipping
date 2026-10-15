<script setup lang="ts">
import type { CalculatorInput } from '@calculadora/shared';
import { DEFAULT_DROPI_COMMISSION, DEFAULT_PROFIT_MARGIN, toNumber } from '@calculadora/shared';
import { reactive } from 'vue';
import FormField from './FormField.vue';

const emit = defineEmits<{ submit: [input: CalculatorInput] }>();

type FieldKey =
  | 'productCost'
  | 'shippingCost'
  | 'productWeightKg'
  | 'shippingCostPerKg'
  | 'supplierPrice'
  | 'profitMargin'
  | 'dropiCommission'
  | 'estimatedCpa'
  | 'orderCount';

interface FieldConfig {
  key: FieldKey;
  id: string;
  label: string;
  unit?: string;
  thousands?: boolean;
}

interface SectionConfig {
  title: string;
  fields: FieldConfig[];
}

const form = reactive<CalculatorInput>({
  productCost: 0,
  shippingCost: 0,
  productWeightKg: 0,
  shippingCostPerKg: 0,
  supplierPrice: 0,
  profitMargin: 25,
  dropiCommission: DEFAULT_DROPI_COMMISSION,
  estimatedCpa: 0,
  orderCount: 1,
});

const sections: SectionConfig[] = [
  {
    title: 'Producto y proveedor',
    fields: [
      { key: 'productCost', id: 'productCost', label: 'Valor del Producto', unit: 'COL', thousands: true },
      { key: 'supplierPrice', id: 'supplierPrice', label: 'Precio Sugerido del Proveedor', unit: 'COL', thousands: true },
      { key: 'dropiCommission', id: 'dropiCommission', label: 'Comisión DROPI', unit: '%' },
    ],
  },
  {
    title: 'Envío y publicidad',
    fields: [
      { key: 'shippingCost', id: 'shippingCost', label: 'Envío fijo', unit: 'COL', thousands: true },
      { key: 'productWeightKg', id: 'productWeightKg', label: 'Peso por unidad', unit: 'kg' },
      { key: 'shippingCostPerKg', id: 'shippingCostPerKg', label: 'Costo de envío por kg', unit: 'COL/kg', thousands: true },
      { key: 'estimatedCpa', id: 'estimatedCpa', label: 'CPA Estimado', unit: 'COL', thousands: true },
    ],
  },
  {
    title: 'Meta y volumen',
    fields: [
      { key: 'profitMargin', id: 'profitMargin', label: 'Porcentaje de Utilidad', unit: '%' },
      { key: 'orderCount', id: 'orderCount', label: 'Cantidad de Pedidos' },
    ],
  },
];

function formatThousands(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
}

function formatDecimal(value: number): string {
  return Number(value).toLocaleString('es-CO', { maximumFractionDigits: 2 });
}

const display = reactive<Record<FieldKey, string>>({
  productCost: formatThousands(form.productCost ?? 0),
  shippingCost: formatThousands(form.shippingCost ?? 0),
  productWeightKg: formatDecimal(form.productWeightKg ?? 0),
  shippingCostPerKg: formatDecimal(form.shippingCostPerKg ?? 0),
  supplierPrice: formatThousands(form.supplierPrice ?? 0),
  profitMargin: String(form.profitMargin ?? DEFAULT_PROFIT_MARGIN),
  dropiCommission: String(form.dropiCommission ?? DEFAULT_DROPI_COMMISSION),
  estimatedCpa: formatThousands(form.estimatedCpa ?? 0),
  orderCount: String(form.orderCount ?? 1),
});

const fieldIndex = new Map<FieldKey, FieldConfig>();
for (const section of sections) {
  for (const field of section.fields) {
    fieldIndex.set(field.key, field);
  }
}

function onUpdate(key: FieldKey, value: string): void {
  const allowDecimal =
    key === 'productWeightKg' || key === 'shippingCostPerKg' || key === 'dropiCommission';
  const sanitized = value.replace(/\s/g, '');
  const normalized = allowDecimal
    ? sanitized.replace(/\./g, '').replace(',', '.')
    : sanitized.replace(/[^\d]/g, '');
  const number = normalized === '' || normalized === '-' ? 0 : Number(normalized);
  const config = fieldIndex.get(key);

  form[key] = number;

  if (normalized === '' || normalized === '-') {
    display[key] = '';
    return;
  }

  if (config?.thousands) {
    display[key] = formatThousands(Number(number));
    return;
  }

  display[key] = allowDecimal ? formatDecimal(Number(number)) : String(number);
}

function onSubmit(): void {
  emit('submit', {
    productCost: toNumber(form.productCost),
    shippingCost: toNumber(form.shippingCost ?? 0),
    productWeightKg: toNumber(form.productWeightKg ?? 0),
    shippingCostPerKg: toNumber(form.shippingCostPerKg ?? 0),
    supplierPrice: toNumber(form.supplierPrice),
    profitMargin: toNumber(form.profitMargin, DEFAULT_PROFIT_MARGIN),
    dropiCommission: toNumber(form.dropiCommission, DEFAULT_DROPI_COMMISSION),
    estimatedCpa: toNumber(form.estimatedCpa),
    orderCount: Math.max(1, Math.floor(toNumber(form.orderCount, 1))),
  });
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <section v-for="section in sections" :key="section.title" class="card">
      <h3>{{ section.title }}</h3>
      <div class="grid">
        <FormField
          v-for="field in section.fields"
          :key="field.id"
          :id="field.id"
          :label="field.label"
          :unit="field.unit"
          :model-value="display[field.key]"
          @update:model-value="onUpdate(field.key, $event)"
        />
      </div>
    </section>

    <button type="submit">Calcular</button>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  overflow: auto;
  scrollbar-width: none;
}

.form::-webkit-scrollbar {
  display: none;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
}

h3 {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-soft);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

button {
  align-self: flex-start;
  padding: 11px 28px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--accent-strong);
  color: #f8fafc;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }

  button {
    align-self: stretch;
  }
}
</style>
