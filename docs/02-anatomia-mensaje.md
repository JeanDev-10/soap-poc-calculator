# 02 · Anatomía de un mensaje SOAP

Un mensaje SOAP es un documento XML con esta estructura:

```
Envelope           (obligatorio) raíz del mensaje
├── Header         (opcional)    metadatos: autenticación, trazas, transacciones
└── Body           (obligatorio) la operación y sus datos, o un Fault
```

## Ejemplo: petición `Add`

```xml
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:calc="http://devnova.com/calculator">
  <soap:Header/>
  <soap:Body>
    <calc:AddRequest>
      <calc:a>5</calc:a>
      <calc:b>3</calc:b>
    </calc:AddRequest>
  </soap:Body>
</soap:Envelope>
```

## Respuesta

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:calc="http://devnova.com/calculator">
  <soap:Body>
    <calc:AddResponse>
      <calc:result>8</calc:result>
    </calc:AddResponse>
  </soap:Body>
</soap:Envelope>
```

## Fault (error)

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Client</faultcode>
      <faultstring>No se puede dividir por cero</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>
```

## Namespaces (¡importante!)
Los prefijos (`soap:`, `calc:`) son solo alias; lo que identifica a un elemento es la **URI del namespace**. El namespace del Envelope define la **versión**:

| Versión | Namespace | Content-Type | Cabecera de acción |
|---------|-----------|--------------|--------------------|
| SOAP 1.1 | `http://schemas.xmlsoap.org/soap/envelope/` | `text/xml` | `SOAPAction: "..."` |
| SOAP 1.2 | `http://www.w3.org/2003/05/soap-envelope` | `application/soap+xml` | `action=` dentro del Content-Type |

Diferencias en Fault: 1.1 usa `faultcode/faultstring`; 1.2 usa `Code/Reason/Detail`. `node-soap` soporta ambos; en este proyecto empezamos con **SOAP 1.1**.

## Probar a mano con curl (lo haremos con la calculadora)

```bash
curl -X POST http://localhost:8000/calculator \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://devnova.com/calculator/Add"' \
  -d '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:calc="http://devnova.com/calculator"><soap:Body><calc:AddRequest><calc:a>5</calc:a><calc:b>3</calc:b></calc:AddRequest></soap:Body></soap:Envelope>'
```

➡️ Anterior: [01](01-que-es-soap.md) · Siguiente: [03 · WSDL y XSD](03-wsdl-y-xsd.md)
