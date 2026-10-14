# AGENTS.md

## Propósito del proyecto
Este repositorio contiene una calculadora de eCommerce / dropshipping y está evolucionando hacia una arquitectura mantenible y profesional.

El objetivo principal es separar claramente:
- Frontend: interfaz de usuario y experiencia visual
- Backend: lógica de negocio, cálculo de precios, utilidades, ROAS y validaciones
- Datos: modelo y persistencia futura

## Principios generales
- Priorizar claridad, mantenibilidad y escalabilidad.
- No mezclar lógica de negocio con HTML, CSS o DOM en archivos estáticos.
- Preferir arquitectura modular y componentes reutilizables.
- Mantener el código legible, ordenado y documentado.
- Evitar soluciones improvisadas cuando ya exista una estructura clara.
- Cuando el usuario diga “sin ejecutar nada” o “ahorrar tokens”, priorizar lectura y diseño sobre ejecución.

## Stack recomendado
- Frontend: Vue 3 + Vite
- Backend: Node.js + NestJS o Express
- Base de datos: PostgreSQL (o MySQL si se requiere simplicidad)
- Estado del frontend: Pinia
- Tipado: TypeScript
- Validación: Zod o Joi
- Linting/format: ESLint + Prettier

## Reglas de trabajo para el agente
1. Revisar primero la estructura del repositorio antes de modificar archivos.
2. No asumir que los archivos HTML actuales son la estructura final; son referencias o prototipos.
3. Mantener una separación clara entre:
   - componentes visuales
   - servicios de negocio
   - APIs
   - utilidades
   - modelos de datos
4. Si se está creando un módulo nuevo, usar nombres claros y consistentes.
5. No crear lógica duplicada.
6. No dejar funciones complejas dentro de componentes UI si pueden vivir en un servicio.
7. Antes de editar, identificar la responsabilidad exacta de cada archivo.
8. Si se requiere un cambio grande, proponer primero la estructura y luego implementarla por etapas.
9. No ejecutar comandos de instalación, build o tests salvo que el usuario lo pida explícitamente.
10. Priorizar cambios pequeños y enfocados.

## Estructura objetivo
```bash
project/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ views/
│  │  ├─ stores/
│  │  ├─ services/
│  │  ├─ utils/
│  │  ├─ App.vue
│  │  └─ main.ts
│  └─ package.json
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ services/
│  │  ├─ modules/
│  │  ├─ validators/
│  │  ├─ dto/
│  │  └─ main.ts
│  └─ package.json
├─ database/
│  └─ schema.sql
├─ README.md
└─ AGENTS.md
```

## Regla de negocio principal
La lógica de la calculadora debe encapsularse en servicios reutilizables, por ejemplo:
- costo total
- utilidad por venta
- porcentaje de utilidad
- ROAS necesario
- facturación
- ganancia total
- precios por cantidad de unidades

Estas fórmulas deben vivir en lógica centralizada y no en eventos inline del DOM.

## Estilo de desarrollo
- Preferir TypeScript sobre JavaScript cuando sea posible.
- Mantener archivos pequeños y con una sola responsabilidad.
- Usar nombres descriptivos: CalculatorForm, ResultCards, calculator.service.ts.
- Evitar comentarios innecesarios; documentar sólo lo necesario.
- Mantener consistencia en idioma y convenciones del proyecto.

## Trabajo con el repositorio actual
El repositorio actual contiene varias pruebas y prototipos HTML. Estos archivos sirven como referencia, pero no deben ser la base de la solución final si se quiere una aplicación mantenible.

Se debe priorizar:
- una arquitectura modular,
- una capa de cálculo centralizada,
- una interfaz gestionable,
- y una separación clara entre presentación y lógica.

## Recomendación final para el flujo del proyecto
1. Organizar la estructura base del proyecto.
2. Crear la capa frontend Vue.
3. Crear la capa backend Node/Nest o Express.
4. Migrar la lógica de cálculo a servicios.
5. Conectar frontend con backend mediante API.
6. Agregar validaciones y pruebas.
7. Mejorar UI y administración.

## Confirmación de cumplimiento
El agente debe trabajar siguiendo estas reglas y no debe iniciar ejecuciones ni instalaciones salvo que el usuario lo solicite explícitamente.
