# 05 · Buenas prácticas

## Diseño del contrato
- **Contract-first**: escribe el WSDL/XSD primero y genera o implementa el código después (como hicimos). El contrato es lo que ve el cliente.
- Usa **`document/literal`** (evita `rpc/encoded`).
- Un **namespace** propio y estable por servicio (`http://empresa.com/servicio`).
- Operaciones con un único elemento de entrada y uno de salida (`XRequest` / `XResponse`): permite evolucionar el mensaje sin romper la firma.
- Campos nuevos como **opcionales** (`minOccurs="0"`) para no romper clientes existentes.

## Versionado
- Cambios compatibles (campos opcionales nuevos): mismo endpoint.
- Cambios que rompen: nuevo namespace o nueva URL (`/v2/library`) y mantener la versión anterior mientras haya clientes.

## Errores
- Siempre `Fault`, nunca un resultado "OK" con un mensaje de error dentro.
- `Sender` para errores del cliente, `Receiver` para los del servidor.
- No filtres stack traces ni detalles internos en el `faultstring`; regístralos en el log y devuelve un mensaje genérico con un id de correlación.

## Seguridad
- **HTTPS (TLS)** siempre; el token de nuestro ejemplo viaja en claro y es solo didáctico.
- Para autenticación estándar: `UsernameToken` de WS-Security o `BasicAuthSecurity` de `node-soap`; firma y cifrado XML si hay intermediarios.
- Valida la entrada contra el XSD y limita el tamaño del cuerpo.
- Cuidado con **XXE** y entidades XML: desactiva DTDs en cualquier parser XML que uses.

## Rendimiento
- SOAP es verboso: habilita compresión HTTP y evita operaciones muy "habladoras"; agrupa datos en una sola llamada.
- Reutiliza el cliente (`createClientAsync` descarga y parsea el WSDL; no lo hagas en cada llamada).
- Para adjuntos grandes, MTOM en lugar de base64 dentro del XML.

## Pruebas y herramientas
- **Vitest** (este proyecto): levanta el servicio en puerto aleatorio y prueba con un cliente real (`npm test`).
- **SoapUI** / **Postman**: importan el WSDL, generan peticiones de ejemplo y permiten probar manualmente.
- `client.lastRequest` / `client.lastResponse` para depurar el XML real.
- Recuerda: el `soap:address` del WSDL manda por defecto; sobrescríbelo con la opción `endpoint` en entornos de prueba.

## Resumen del recorrido
| Lección | Código |
|---------|--------|
| 01–02 Qué es SOAP y su mensaje | curl con Envelope manual |
| 03 WSDL y XSD | `src/calculator/calculator.wsdl` |
| 04 Faults y headers | `src/library/` (token, 401/404) |
| 05 Buenas prácticas | tests en `*.test.ts` |

⬅️ Anterior: [04](04-faults-y-headers.md)
