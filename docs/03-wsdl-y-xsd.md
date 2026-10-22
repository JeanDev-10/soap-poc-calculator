# 03 · WSDL y XSD

El **WSDL** (Web Services Description Language) es el contrato del servicio. Responde: *¿qué operaciones hay, qué reciben, qué devuelven y dónde están?*

## Las 6 secciones (de abstracto a concreto)

| Sección | Pregunta que responde | En la calculadora |
|---------|----------------------|-------------------|
| `<types>` | ¿Qué datos existen? (XSD) | `AddRequest {a, b}`, `AddResponse {result}` |
| `<message>` | ¿Qué mensajes se envían? | `AddIn`, `AddOut` |
| `<portType>` | ¿Qué operaciones hay? (interfaz) | `Add`, `Subtract`, `Divide` |
| `<binding>` | ¿Cómo viajan? (SOAP, estilo, SOAPAction) | `document/literal` sobre HTTP |
| `<service>` / `<port>` | ¿Dónde está? (URL) | `http://localhost:8000/calculator` |

Lo abstracto (`types`, `message`, `portType`) es independiente del transporte; lo concreto (`binding`, `service`) lo ata a SOAP/HTTP.

## Estilo `document/literal`
Es el estándar actual: el Body contiene un documento XML validado por el XSD (`<calc:AddRequest>…`). Evita `rpc/encoded`, obsoleto y poco interoperable.

## XSD en 30 segundos
```xml
<xs:element name="AddRequest">
  <xs:complexType>
    <xs:sequence>
      <xs:element name="a" type="xs:double"/>
      <xs:element name="b" type="xs:double"/>
    </xs:sequence>
  </xs:complexType>
</xs:element>
```
- `xs:sequence` → el orden de los hijos importa.
- Tipos básicos: `xs:string`, `xs:int`, `xs:double`, `xs:boolean`, `xs:dateTime`.
- `minOccurs="0"` hace un campo opcional; `maxOccurs="unbounded"` permite listas.

Mira el WSDL real en `src/calculator/calculator.wsdl` (cada sección está comentada).

➡️ Anterior: [02](02-anatomia-mensaje.md) · Siguiente: [04 · Faults y headers](04-faults-y-headers.md)
