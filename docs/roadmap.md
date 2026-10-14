# Roadmap del proyecto

## Fase 1: Base arquitectónica

Objetivo: dejar una estructura modular y profesional.

### Incluye
- monorepo con workspaces
- capa `shared`
- backend Express + TypeScript
- frontend Vue 3 + Vite
- lógica de negocio separada de la UI
- esquema SQL y modelos de referencia

### Fuera de alcance
- base de datos operativa
- autenticación
- administración avanzada
- persistencia de cálculos reales

## Fase 2: Validación y robustez

Objetivo: solidificar la API y la capa compartida.

### Incluye
- pruebas de validadores
- pruebas de controladores
- manejo de errores
- contract testing de entrada/salida

## Fase 3: UX y administración

Objetivo: hacer la app más útil y visualmente profesional.

### Incluye
- dashboard con historial
- mejoras en UI
- reutilización de componentes
- filtros y resultados más claros

## Fase 4: Persistencia real

Objetivo: soportar almacenamiento real.

### Incluye
- PostgreSQL o MySQL
- migraciones
- repositorios
- guardado de cálculos y productos

## Reglas de avance

- avanzar por etapas, no por features aisladas sin arquitectura
- priorizar lógica reutilizable antes que adornos visuales
- mantener el proyecto listo para portfolio en cada etapa
- no ejecutar instalaciones o arranques sin autorización explícita
