---
applyTo: "frontend/**,backend/**,shared/**"
description: "Integrar frontend y backend para la calculadora de eCommerce, sin abrir persistencia ni features adicionales."
---

# Integración frontend-backend

## Objetivo
Conectar la interfaz del frontend con la API del backend usando la capa `shared` como fuente de verdad y manteniendo la arquitectura modular.

## Reglas obligatorias

1. No crear base de datos ni persistencia real en esta etapa.
2. No añadir features nuevas fuera del flujo de cálculo y resultados.
3. Mantener la lógica de negocio en `shared/` y no duplicarla en componentes Vue.
4. Validar la API en backend antes de consumirla desde el frontend.
5. La UI debe consumir los endpoints reales del backend y manejar errores de carga.
6. No ejecutar instalaciones, builds ni arranques sin autorización explícita del usuario.
7. Si se detecta un cambio grande, explicar la estructura antes de implementarlo.
8. Priorizar cambios pequeños, claros y reutilizables.

## Stack objetivo

- Frontend: Vue 3 + Vite + Pinia
- Backend: Express + TypeScript
- Validación: Zod
- Lógica compartida: `shared/`

## Alcance permitido

- conectar formulario del frontend con la API
- consumir `POST /api/calculator`
- consumir `POST /api/calculator/score` si aplica
- mostrar resultados en tarjetas o componentes visuales
- manejar loading y error states
- mantener componentes pequeños y reutilizables
- usar `calculator.store.ts` como punto de integración del estado

## Fuera de alcance

- autenticación
- usuarios
- base de datos operativa
- historial persistente
- dashboards avanzados
- módulos no relacionados con la calculadora

## Contrato API esperado

- `POST /api/calculator`
  - recibe: `productCost`, `shippingCost`, `supplierPrice`, `profitMargin`, `dropiCommission`, `estimatedCpa`, `orderCount`
  - devuelve: resultados de cálculo con `idealSalePrice`, `profitPerSale`, `totalProfit`, etc.

- `POST /api/calculator/score`
  - recibe: indicadores de score del producto
  - devuelve: `score` y `maxScore`

- `GET /health`
  - responde: `{ status: 'ok' }`

## Criterios de calidad

- mantener la separación entre presentación y negocio
- usar servicios y stores para encapsular llamadas
- no mezclar lógica de cálculo dentro de Vue components
- mantener nombres claros y consistentes
- documentar solo lo que realmente necesite ser entendido

## Resultado esperado

Una integración funcional entre frontend y backend donde la UI renderiza resultados reales basados en la API, con una base limpia y lista para continuar con mejoras posteriores.