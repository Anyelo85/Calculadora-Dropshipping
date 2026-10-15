<script setup lang="ts">
import type { CalculatorInput, CalculatorResult } from '@calculadora/shared';
import {
  DEFAULT_DROPI_COMMISSION,
  formatCurrency,
  formatPercentage,
  round2,
} from '@calculadora/shared';
import { computed } from 'vue';

const props = defineProps<{ result: CalculatorResult; input: CalculatorInput }>();

const orderCount = computed(() => {
  if (props.result.idealSalePrice <= 0) {
    return 0;
  }

  return Math.round(props.result.totalBilling / props.result.idealSalePrice);
});

const unitPrices = computed(() => {
  const productCost = props.input.productCost ?? 0;
  const shippingCost = props.input.shippingCost ?? 0;
  const productWeightKg = props.input.productWeightKg ?? 0;
  const shippingCostPerKg = props.input.shippingCostPerKg ?? 0;
  const estimatedCpa = props.input.estimatedCpa ?? 0;
  const commissionRate = props.input.dropiCommission ?? DEFAULT_DROPI_COMMISSION;

  const tiers = [
    {
      label: '1 unidad',
      count: 1,
      price: props.result.idealSalePrice,
      discount: 0,
      tag: 'Precio base',
    },
    {
      label: '2 unidades',
      count: 2,
      price: props.result.idealSalePriceTwoUnits,
      discount: 20,
      tag: 'Promoción',
    },
    {
      label: '3 unidades',
      count: 3,
      price: props.result.idealSalePriceThreeUnits,
      discount: 30,
      tag: 'Promoción',
    },
  ];

  return tiers.map((tier) => {
    const valor = round2(productCost * tier.count);
    const transportePorPeso = round2(productWeightKg * shippingCostPerKg * tier.count);
    const transporteTotal = round2(shippingCost + transportePorPeso);
    const comisionPorVenta = round2(tier.price * (commissionRate / 100));
    const cpaPorAccion = round2(estimatedCpa);
    const costoOferta = round2(valor + transporteTotal + comisionPorVenta + cpaPorAccion);
    const ganancia = round2(tier.price - costoOferta);
    const utilidadRealSobreCosto = costoOferta > 0 ? round2((ganancia / costoOferta) * 100) : 0;
    const utilidadObjetivo = props.input.profitMargin ?? 30;
    const descuentoMaximoMantenerUtilidad =
      tier.price > 0
        ? round2(1 - (costoOferta * (1 + utilidadObjetivo / 100)) / (tier.price))
        : 0;

    return {
      label: tier.label,
      count: tier.count,
      price: tier.price,
      tag: tier.tag,
      discount: tier.discount,
      perUnit: tier.count > 1 ? tier.price / tier.count : null,
      breakdown: [
        { key: 'valor', label: 'Valor', value: valor },
        { key: 'transporte', label: 'Transporte', value: transporteTotal },
        { key: 'comision', label: 'Comisión DROPI / venta', value: comisionPorVenta },
        { key: 'cpa', label: 'CPA / acción', value: cpaPorAccion },
        { key: 'ganancia', label: 'Ganancia', value: ganancia },
      ],
      promoMetrics: [
        {
          label: 'Utilidad real sobre el costo',
          value: `${utilidadRealSobreCosto}%`,
        },
        {
          label: 'Descuento máximo para mantener la utilidad objetivo',
          value: `${Math.max(0, descuentoMaximoMantenerUtilidad * 100).toFixed(2)}%`,
        },
      ],
    };
  });
});

const perSaleCards = computed(() => [
  { label: 'Costo Total', value: formatCurrency(props.result.totalCost) },
  { label: 'Ganancia por Venta', value: formatCurrency(props.result.profitPerSale) },
  { label: 'Porcentaje de Ganancia', value: formatPercentage(props.result.profitPercentage) },
  { label: 'ROAS Necesario', value: props.result.requiredRoas.toFixed(2) },
]);

const isProfit = computed(() => props.result.totalProfit >= 0);
</script>

<template>
  <div class="results">
    <section class="block">
      <div class="block-head">
        <h2>Precio de venta ideal</h2>
        <p>Precio para publicar en tu tienda. No depende de la cantidad de pedidos.</p>
      </div>
      <div class="cards three">
        <article v-for="unit in unitPrices" :key="unit.label" class="card" :class="{ promo: unit.discount > 0 }">
          <div class="tier-head">
            <p class="label">{{ unit.label }}</p>
            <span v-if="unit.discount > 0" class="promo-badge">-{{ unit.discount }}%</span>
          </div>
          <p class="value">{{ formatCurrency(unit.price) }}</p>
          <p v-if="unit.perUnit" class="sub">{{ formatCurrency(unit.perUnit) }} por unidad</p>
          <p v-if="unit.discount > 0" class="tag">{{ unit.tag }}</p>
          <ul class="breakdown">
            <li
              v-for="item in unit.breakdown"
              :key="item.key"
              :class="{ negative: item.value < 0 }"
            >
              <span>{{ item.label }}</span>
              <span>{{ formatCurrency(item.value) }}</span>
            </li>
          </ul>

          <div v-if="unit.discount > 0" class="extra-metrics">
            <div v-for="metric in unit.promoMetrics" :key="metric.label" class="metric-row">
              <span>{{ metric.label }}</span>
              <strong>{{ metric.value }}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Por cada venta (1 unidad)</h2>
        <p>Valores de una sola unidad.</p>
      </div>
      <div class="cards four">
        <article v-for="card in perSaleCards" :key="card.label" class="card">
          <p class="label">{{ card.label }}</p>
          <p class="value">{{ card.value }}</p>
        </article>
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Total de tus {{ orderCount }} pedidos</h2>
        <p class="summary">
          {{ orderCount }} pedidos de 1 unidad a
          <strong>{{ formatCurrency(result.idealSalePrice) }}</strong>
        </p>
      </div>
      <div class="cards two">
        <article class="card">
          <p class="label">Facturación Total</p>
          <p class="value">{{ formatCurrency(result.totalBilling) }}</p>
        </article>
        <article class="card highlight" :class="isProfit ? 'profit' : 'loss'">
          <p class="label">Ganancia Total</p>
          <p class="value big">{{ formatCurrency(result.totalProfit) }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.results {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: auto;
  scrollbar-width: none;
}

.results::-webkit-scrollbar {
  display: none;
}

.block-head {
  margin-bottom: 10px;
}

h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-soft);
}

.block-head p {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--text-muted);
}

.summary strong {
  color: var(--text-soft);
}

.cards {
  display: grid;
  gap: 12px;
}

.three {
  grid-template-columns: repeat(3, 1fr);
}

.four {
  grid-template-columns: repeat(4, 1fr);
}

.two {
  grid-template-columns: repeat(2, 1fr);
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.tier-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.promo-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #a7f3d0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.value {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
}

.sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.tag {
  margin: 8px 0 0;
  font-size: 11px;
  font-weight: 600;
  color: #86efac;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.promo {
  border-color: rgba(16, 185, 129, 0.35);
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.85));
}

.breakdown {
  margin: 10px 0 0;
  padding: 10px 0 0;
  list-style: none;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breakdown li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-muted);
}

.breakdown li span:last-child {
  font-weight: 600;
  color: var(--text-soft);
  white-space: nowrap;
}

.breakdown li.negative span:last-child {
  color: var(--loss);
}

.extra-metrics {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
}

.metric-row strong {
  color: var(--text-soft);
  white-space: nowrap;
}

.highlight {
  padding: 20px 22px;
}

.highlight .label {
  font-size: 13px;
}

.big {
  font-size: 30px;
}

.profit .value {
  color: var(--profit);
}

.loss .value {
  color: var(--loss);
}

@media (max-width: 900px), (max-height: 660px) {
  .results {
    height: auto;
    overflow: visible;
  }
}

@media (max-width: 700px) {
  .three,
  .four,
  .two {
    grid-template-columns: 1fr;
  }
}
</style>
