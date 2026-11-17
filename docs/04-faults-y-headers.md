# 04 · Faults y headers

## Fault: el error estándar de SOAP
Cuando algo falla, el servidor responde con un `Fault` dentro del Body (y normalmente HTTP 500).

| | SOAP 1.1 | SOAP 1.2 |
|---|----------|----------|
| Código | `<faultcode>` | `<Code><Value>` |
| Mensaje | `<faultstring>` | `<Reason><Text>` |
| Detalle | `<detail>` | `<Detail>` |
| Origen | `Client` / `Server` | `Sender` / `Receiver` |

**Regla práctica**
- `Sender` (1.1: `Client`): la petición es incorrecta (datos inválidos, sin permiso, recurso inexistente). Reintentar igual no sirve.
- `Receiver` (1.1: `Server`): falló el servidor (BD caída, bug). Puede tener sentido reintentar.

En `node-soap` se lanza un objeto con `Fault`:
```ts
throw { Fault: { Code: { Value: 'soap:Sender' }, Reason: { Text: 'Libro no encontrado' }, statusCode: 404 } };
```
Y el cliente lo recibe como excepción (`err.root.Envelope.Body.Fault`).

## Headers: metadatos fuera del Body
El `Header` lleva información **sobre** el mensaje, no parte de la operación: autenticación, id de correlación, transacción, idioma…

```xml
<soap:Header>
  <lib:Token>secret-token</lib:Token>
</soap:Header>
```
- Server (`node-soap`): el handler recibe los headers como 3.er argumento: `(args, cb, headers)`.
- Client: `client.addSoapHeader(...)` antes de llamar a la operación.

## Seguridad: WS-Security (intro)
El token simple de nuestro ejemplo es didáctico. En producción:
- **TLS (HTTPS)** siempre.
- **WS-Security** define `UsernameToken`, firmas XML y cifrado a nivel de mensaje en un header `wsse:Security`. `node-soap` incluye `WSSecurity` y `BasicAuthSecurity`.

➡️ Anterior: [03](03-wsdl-y-xsd.md) · Práctica: `src/library/`
