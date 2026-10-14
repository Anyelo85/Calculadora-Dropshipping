# Arquitectura del proyecto

## Visión general

Este proyecto está diseñado como un monorepo con tres capas principales:

- `shared/`: lógica de negocio pura y reutilizable
- `backend/`: API y validación
- `frontend/`: interfaz visual con Vue 3

La capa `database/` existe como preparación para persistencia futura, pero no como dependencia funcional activa en esta etapa.

## Principios

- Separación clara de responsabilidades
- Lógica de negocio fuera del DOM
- Servicios reutilizables y puros
- Validación en backend
- Arquitectura modular para crecer sin caos

## Diagrama conceptual

```text
[Frontend Vue]
      |
      | HTTP
      v
[Backend Express + TypeScript]
      |
      | delega a
      v
[shared / services + utils]
      |
      | reglas de cálculo
      v
[database schema/models]  (futuro / referencia)
```

## Capa shared

La capa `shared` debe contener cero dependencias del navegador ni del backend. Sus servicios deben aceptar datos simples y devolver resultados predictibles.

### Servicios actuales esperados

- `pricing.service`
- `profitability.service`
- `product-score.service`
- `calculator.service`

### Responsabilidades

- cálculo matemático
- normalización de valores
- redondeo
- tipos compartidos
- default values de negocio

## Capa backend

El backend debe ser una delgada capa de orquestación:

- parsea request
- valida payload con Zod
- llama a `shared`
- responde con JSON limpio

### Responsabilidades recomendadas

- `controllers/`: HTTP handlers
- `validators/`: schemas de validación
- `services/`: adaptadores de negocio y orquestación
- `dto/`: contractos de entrada/salida

## Capa frontend

El frontend se centra en UX y consumo de API.

### Responsabilidades recomendadas

- formulario y validación visual
- wiring con store de Pinia
- presentación de resultados
- manejo de carga y errores

### Reglas

- no duplicar fórmulas del negocio
- no hacer lógica compleja en componentes
- usar store para decisiones reutilizables

## Persistencia

La base de datos no se implementa como capa operativa todavía. El esquema SQL y los modelos son una preparación para una segunda fase.

Esto permite:
- diseñar la estructura futura
- evitar rework
- mantener la lógica actual enfocada en cálculo y presentación

## Flujos de trabajo

### Flujo de cálculo

1. Frontend envía input
2. Backend valida schema
3. Backend llama a `shared`
4. `shared` calcula resultados
5. Backend devuelve JSON
6. Frontend renderiza resultados

### Flujo de producto / score

1. Frontend envía atributos del producto
2. Backend valida
3. `product-score.service` devuelve evaluación por /5

## Reglas de mantenimiento

- no mezclar lógica con HTML o CSS
- no crear funciones duplicadas
- no cambiar el scope de una capa sin justificarlo
- mantener servicios pequeños y claros
- documentar decisiones importantes en README y docs

## Estado actual

La base arquitectónica está preparada con foco en la capa compartida y la separación de responsabilidades. La persistencia real y la ampliación de features quedan para una fase posterior.
