# 01 · ¿Qué es SOAP?

**SOAP** (Simple Object Access Protocol) es un protocolo para intercambiar mensajes **XML** estructurados entre sistemas, normalmente sobre **HTTP** (también puede ir sobre SMTP, JMS, etc.).

La idea clave: el cliente y el servidor se ponen de acuerdo en un **contrato formal** (el WSDL) y todos los mensajes siguen un **sobre** (Envelope) estándar.

## Piezas del ecosistema

| Pieza | Para qué sirve |
|-------|----------------|
| **SOAP** | Define el formato del mensaje (Envelope, Header, Body, Fault). |
| **WSDL** | Describe el servicio: operaciones, tipos de datos, URL. Es el "contrato". |
| **XSD** | Esquema XML que define los tipos de datos del WSDL. |
| **WS-\*** | Extensiones: WS-Security, WS-Addressing, WS-ReliableMessaging… |

## SOAP vs REST vs gRPC

| | SOAP | REST | gRPC |
|---|------|------|------|
| Formato | XML | JSON (usual) | Protobuf binario |
| Contrato | WSDL (obligatorio, fuerte) | OpenAPI (opcional) | `.proto` (obligatorio) |
| Transporte | HTTP, otros | HTTP | HTTP/2 |
| Estilo | Operaciones (RPC/mensajes) | Recursos + verbos | Servicios RPC |
| Errores | `Fault` estándar | Códigos HTTP | Status codes |
| Seguridad estándar | WS-Security | TLS + OAuth/JWT | TLS + tokens |

## ¿Cuándo se usa hoy?
- Banca, seguros, gobierno, telecom, ERPs (SAP, Oracle) y sistemas legados.
- Cuando se necesita un **contrato estricto**, transacciones o seguridad a nivel de mensaje.
- Integraciones B2B donde la contraparte ya expone SOAP.

## Ventajas y desventajas
**+** Contrato fuerte y autodescriptivo, generación automática de clientes, estándares de seguridad maduros, independiente del transporte.
**−** Verboso (XML pesado), más complejo, curva de aprendizaje, menos usado en proyectos nuevos.

## Ciclo de una llamada
1. El cliente lee el **WSDL** (`http://host/servicio?wsdl`).
2. Construye un **Envelope** XML con la operación y sus parámetros.
3. Lo envía por **HTTP POST**.
4. El servidor responde con un Envelope de respuesta, o con un **Fault** si hubo error.

➡️ Siguiente: [02 · Anatomía de un mensaje](02-anatomia-mensaje.md)
