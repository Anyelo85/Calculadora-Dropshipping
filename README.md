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
  - Presenta el formulario y los resultados.
  - Usa la API cuando está configurada y puede calcular localmente con `shared/`.
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

El frontend mantiene las fórmulas fuera de los componentes y delega el cálculo a `shared/` cuando no usa la API. Sus responsabilidades son:
- recolectar y validar los datos del usuario
- enviar la solicitud al backend si está habilitado, o llamar a `shared/` localmente
- mostrar resultados
- manejar errores y carga

### Componentes actuales

- `CalculatorForm.vue`: formulario principal
- `ResultCards.vue`: tarjetas de resultados
- `calculator.store.ts`: estado global con Pinia

### Integración con la API

- `src/services/calculator.api.ts` es el único punto de contacto con el backend.
- El backend se usa solo cuando `VITE_USE_BACKEND=true` y `VITE_API_URL` tiene una URL configurada.
- Las peticiones se envían a `${VITE_API_URL}/api/...`; el archivo `frontend/.env.development` configura el backend local en `http://localhost:3000`.
- El cliente valida las entradas con Zod. Los errores JSON del backend (por ejemplo, HTTP 400) se muestran en el formulario.
- Si el backend no está habilitado, no se envían peticiones HTTP y el cálculo se ejecuta con los servicios de `shared/`.
- Si una API configurada devuelve 404, 405 o una respuesta que no sea JSON, el frontend usa el cálculo local como fallback.
- `frontend/.env.example` documenta las variables necesarias para habilitar el backend.

### Desarrollo local

Instala las dependencias desde la raíz del repositorio:

```bash
npm ci
```

Inicia backend y frontend en terminales separadas:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

El modo de desarrollo carga `frontend/.env.development` y usa Express en `http://localhost:3000`. Para trabajar sin backend, desactiva `VITE_USE_BACKEND` o deja `VITE_API_URL` sin configurar; la calculadora seguirá funcionando localmente.

### GitHub Pages

GitHub Pages sirve archivos estáticos y no ejecuta Express. El workflow `.github/workflows/deploy.yml` compila el frontend con `VITE_USE_BACKEND=false`, por lo que la calculadora usa `shared/` en el navegador sin llamar a `/api`. La base de Vite está configurada para el subdirectorio `/Calculadora-Dropshipping/`.

Para publicar, configura **Settings → Pages → Source → GitHub Actions** en GitHub. Cada push a `main` inicia el despliegue. La aplicación publicada está en <https://anyelo85.github.io/Calculadora-Dropshipping/>.

Para probar localmente la build de producción:

```bash
cd frontend
npm run build
npm run preview
```

## Base de datos: referencia futura

La carpeta `database/` contiene:
- `schema.sql` con la estructura inicial
- `models/` con definiciones conceptuales para persistencia futura

Se mantiene solo como referencia para una etapa posterior. Por ahora no se contempla una conexión real ni migración activa.

## Reglas de arquitectura

1. Mantener el cálculo en `shared/` y no dentro del DOM.
2. Evitar duplicación de fórmulas.
3. Un componente visual no debe contener lógica de negocio compleja.
4. Validar en el cliente para dar feedback inmediato y volver a validar en backend.
5. Mantener un flujo claro: input → validación → API o `shared/` → resultado.
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
