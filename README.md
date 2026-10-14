# Calculadora Dropshipping

Proyecto orientado a una calculadora de eCommerce / dropshipping con una arquitectura modular y mantenible, pensado como base para un portfolio profesional.

## Objetivo

Centralizar la lógica de cálculo en una capa compartida y separar claramente:
- frontend: interfaz visual y experiencia de usuario
- backend: validación y API
- shared: lógica de negocio reutilizable
- database: esquema y modelado de referencia

Los archivos HTML de la raíz son referencias históricas y prototipos, no la arquitectura final del proyecto.

## Stack recomendado

- Frontend: Vue 3 + Vite
- Backend: Express + TypeScript
- Lógica compartida: `shared/`
- Validación: Zod
- Estado del frontend: Pinia
- Testing: Vitest
- Base de datos: PostgreSQL como referencia futura; por ahora solo esquema SQL y modelos

## Visión de arquitectura

La idea principal es evitar mezclar cálculo con DOM, HTML y eventos inline. Todo el negocio vive en servicios puros y reutilizables.

### Capas

1. `shared/`
   - Contiene tipos, utilidades, constantes y servicios de cálculo.
   - Es la fuente de verdad para fórmulas y reglas de negocio.
   - Debe poder reutilizarse por backend y frontend.

2. `backend/`
   - Expone la API REST.
   - Valida entradas con Zod.
   - Orquesta la lógica de cálculo y devuelve respuestas consistentes.

3. `frontend/`
   - Consume la API.
   - La vista solo debe mostrar datos y reaccionar a eventos de usuario.
   - El estado vive en Pinia.

4. `database/`
   - Esquema SQL y modelos de referencia para persistencia futura.
   - No es la capa funcional activa por ahora.

## Estructura actual del repositorio

```bash
calculadora-dropshipping/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ shared/
│  ├─ src/
│  │  ├─ constants/
│  │  ├─ services/
│  │  ├─ types/
│  │  ├─ utils/
│  │  ├─ index.ts
│  │  └─ ...
│  ├─ tests/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ vitest.config.ts
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ dto/
│  │  ├─ modules/
│  │  ├─ services/
│  │  ├─ validators/
│  │  └─ main.ts
│  ├─ package.json
│  └─ tsconfig.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ services/
│  │  ├─ stores/
│  │  ├─ views/
│  │  ├─ App.vue
│  │  └─ main.ts
│  ├─ index.html
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ vite.config.ts
├─ database/
│  ├─ schema.sql
│  └─ models/
├─ Analisis-Js-index.html
├─ calculadora_ventas.html
├─ calculadora_Ventas.js
├─ cauladora_facundo.html
└─ CAculadora Ecommerce.xlsx
```

## Capa shared: lógica de negocio

La capa `shared` es la pieza central del proyecto. Aquí viven los cálculos puros que no deben depender del DOM ni del framework.

### Servicios principales

- `pricing.service.ts`
  - costo total
  - precio de venta ideal
  - piso mínimo con precio del proveedor
  - precios para 2 y 3 unidades

- `profitability.service.ts`
  - ganancia por venta
  - porcentaje de ganancia
  - ROAS
  - facturación
  - ganancia total

- `product-score.service.ts`
  - evaluación del producto en escala /5

- `calculator.service.ts`
  - orquesta los cálculos
  - centraliza defaults y normalización
  - expone el contrato del cálculo final

### Utilidades

- `numbers`: redondeo y conversión seguras a número
- `format`: formateo visual para dominio y UI

## Backend: API REST

El backend es responsable de:
- recibir el payload
- validar entradas con Zod
- delegar a la lógica de `shared`
- responder con JSON estable

### Endpoints esperados

- `POST /api/calculator`
- `POST /api/calculator/score`
- `GET /health`

### Patrón recomendado

- controller: recibe request/response
- validator: valida schema
- service: orquesta negocio
- shared: contiene la lógica reusada

## Frontend: vista y consumo

El frontend no debe calcular la lógica de negocio. Solo debe:
- recolectar datos del usuario
- enviar request a la API
- mostrar resultados
- manejar errores y carga

### Componentes actuales

- `CalculatorForm.vue`: formulario principal
- `ResultCards.vue`: tarjetas de resultados
- `calculator.store.ts`: estado global con Pinia

### Integración con la API

- `src/services/calculator.api.ts` es el único punto de contacto con el backend.
- El frontend usa rutas relativas (`/api/...`) y el proxy de desarrollo de Vite reenvía a `http://localhost:3000`.
- `VITE_API_URL` (ver `.env.example`) permite apuntar a una URL absoluta en despliegue.
- Los errores del backend se propagan como `ApiError` con `status` y `fieldErrors`, y el store los expone al estado.

## Base de datos: referencia futura

La carpeta `database/` contiene:
- `schema.sql` con la estructura inicial
- `models/` con definiciones conceptuales para persistencia futura

Se mantiene solo como referencia para una etapa posterior. Por ahora no se contempla una conexión real ni migración activa.

## Reglas de arquitectura

1. Mantener el cálculo en `shared/` y no dentro del DOM.
2. Evitar duplicación de fórmulas.
3. Un componente visual no debe contener lógica de negocio compleja.
4. Validar siempre en backend.
5. Mantener un flujo claro: input → validator → service → result.
6. No iniciar instalaciones, builds o ejecuciones sin autorización explícita del usuario.

## Fases del proyecto

### Fase 1: Base arquitectónica
- estructura monorepo
- `shared` con lógica pura
- backend con API mínima
- frontend con formulario básico
- esquema SQL y modelos de referencia

### Fase 2: Validación y robustez
- pruebas del backend
- validaciones avanzadas
- manejo de errores
- contratos de API más claros

### Fase 3: UX y administración
- dashboard visual
- filtros y resultados más completos
- mejor experiencia de usuario

### Fase 4: Persistencia real
- conexión a base de datos
- modelos concretos
- guardado/retrieval de cálculos y productos

## Recomendaciones de trabajo

- Mantener cambios pequeños y enfocados.
- Revisar la estructura del repositorio antes de modificar archivos.
- No crear lógica duplicada.
- Usar nombres claros y consistentes.
- Dar prioridad a claridad y mantenibilidad sobre soluciones improvisadas.

## Nota de ejecución

La intención de esta base es preparar una arquitectura profesional para un proyecto de portfolio. Las ejecuciones reales se gestionan solo cuando el usuario lo autorice.

## Documento de reglas del agente

Se recomienda seguir también la guía en [AGENTS.md](AGENTS.md).
