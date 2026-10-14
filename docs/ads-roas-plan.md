# Plan de módulo Ads / ROAS

## Objetivo
Adicionar una segunda vista orientada a marketing y rentabilidad publicitaria, inspirada en calculadoras de Facebook Ads, sin romper la estructura actual del proyecto.

## Principio de diseño
La lógica de publicidad debe mantenerse separada de la vista y de la lógica de producto. La capa `shared` debe ser la fuente de verdad para cualquier fórmula reutilizable.

## Módulo propuesto

### 1. Capa shared
Crear un servicio nuevo en `shared/src/services/ads.service.ts` o `marketing.service.ts` con funciones puras para:

- `calculateRoas(revenue, adSpend)`
- `calculateBreakEvenRoas(marginRate)`
- `calculateRecommendedCpa(targetMargin, averageOrderValue)`
- `calculateBudgetForTargetRevenue(targetRevenue, roasTarget)`
- `calculateNetProfit(revenue, productCost, adSpend, otherCosts)`

### 2. Backend
Agregar endpoints REST para esta capa:

- `POST /api/ads/roas`
- `POST /api/ads/break-even`
- `POST /api/ads/budget`

Cada endpoint debe:
- validar inputs con Zod
- llamar a la lógica compartida
- responder con JSON limpio

### 3. Frontend
Agregar una nueva vista o sección para Ads / ROAS con:

- ingreso de revenue
- gasto publicitario
- margen / costo producto
- objetivo de ROAS
- resultado de ROAS real
- break-even ROAS
- presupuesto recomendado
- beneficio neto estimado

### 4. UI recomendada
Diseño simple y orientado a decisión:

- tarjeta principal: ROAS real
- tarjeta: break-even ROAS
- tarjeta: presupuesto recomendado
- tarjeta: beneficio neto

## Fórmulas base

- `ROAS = revenue / adSpend`
- `breakEvenROAS = 1 / grossMarginRate`
- `netProfit = revenue - totalCost - adSpend`
- `budget = targetRevenue / roasTarget`
- `recommendedCpa = profitPerSale * targetMargin` o versión equivalente según negocio

## CPA: concepto y referencia para campañas

### Qué es el CPA
El CPA (Costo por Acción) es el costo de cada acción o conversión deseada, como una compra, un lead, un registro o cualquier objetivo definido por la campaña. Se calcula dividiendo el gasto total publicitario entre la cantidad total de conversiones realizadas.

En términos simples:

- `CPA = gasto total / total de conversiones`

El CPA varía según la industria, la calidad del embudo, la oferta del producto y la eficiencia de la página de destino. Un CPA bajo no siempre significa mejor rentabilidad si la calidad de la conversión es mala; la clave es evaluar el valor de esa conversión frente al costo.

### Importancia del CPA en Facebook Ads
El CPA es una métrica clave para decidir si una campaña es rentable. Si el costo por acción supera el beneficio neto que genera cada venta, la campaña puede estar destruyendo margen aunque el volumen de tráfico sea alto.

Por ello, en una estrategia de ads se debe comparar:

- CPA real vs. CPA objetivo
- valor del cliente vs. costo de adquisición
- ROAS de la campaña vs. ROAS mínimo viable

### Referencia ilustrativa para Facebook Ads en 2025
A modo de referencia orientativa, los costos de anuncios en Facebook varían según la industria y el tipo de campaña:

- CPM promedio: entre $6.73 y $13.46 dependiendo del sector
- CPC promedio: entre $0.42 y $1.86 según la categoría
- Gasto habitual para pequeñas empresas: entre $5 y $50 diarios

Estas cifras sirven como referencia para benchmarking, no como regla fija. El costo real depende del público, la creatividad, la oferta y la optimización constante de la campaña.

### Relación entre CPA y ROAS
La relación más útil para evaluar rentabilidad es:

- ROAS = ingresos / inversión publicitaria
- CPA = inversión publicitaria / conversiones

Si una campaña tiene un CPA muy bajo, pero el producto tiene bajo margen, puede seguir sin ser rentable. Por eso se recomienda combinar CPA con ROAS, margen bruto y valor promedio de pedido para tomar decisiones de inversión más inteligentes.

## Reglas de arquitectura

- no mezclar cálculo en componentes Vue
- no usar el DOM para lógica matemática
- mantener cada módulo con responsabilidad única
- seguir usando `shared/` como capa reusable para negocio

## Alcance recomendado

### Fase 1
- módulo de ROAS + presupuesto + break-even

### Fase 2
- mejorar UX visual
- agregar validación de rango y mensajes de error
- incluir comparativa por campaña

### Fuera de alcance por ahora
- base de datos
- historial persistente
- autenticación
- dashboard complejo

## Resultado esperado
Una segunda vista profesional que complemente la calculadora principal y muestre la capacidad del proyecto para analizar no solo precio y margen, sino también performance publicitaria y rentabilidad real.
