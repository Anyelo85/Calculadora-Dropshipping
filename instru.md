ya probamos la app local y produce los valores correctos. El resultado antiguo en Pages viene de una versión que todavía trata el 5% como $5 fijo; los cambios locales de cálculo aún no estaban publicados.

Puedes pasarle esta instrucción:


La calculadora local ya fue probada y da el resultado correcto. No reescribas la fórmula ni dupliques el cambio.

Caso de regresión:
- producto: 62.500
- envío fijo: 22.000
- proveedor: 0
- comisión DROPI: 5%
- margen: 25%
- CPA, peso y envío por kg: 0
- pedidos: 1

Esperado:
- precio de venta y facturación: 112.666,67 COL
- comisión DROPI: 5.633,33 COL
- costo total: 90.133,33 COL
- ganancia: 22.533,34 COL

El resultado viejo (105.631,25 COL y comisión 5,00 COL) se obtiene al sumar el 5 como pesos fijos. Confirma que el source actual excluya la comisión del costo base, calcule la comisión como 5% del precio de venta y muestre ese monto en la tarjeta.

Después, identifica por qué GitHub Pages sigue sirviendo la versión anterior. Revisa los cambios pendientes y publica solo los archivos necesarios para este cálculo; no incluyas otros cambios locales ni borres los HTML históricos. Ejecuta las pruebas y la build, y confirma el resultado en Pages tras terminar el workflow.