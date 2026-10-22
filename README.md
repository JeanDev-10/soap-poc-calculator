# Test SOAP

PoC para aprender SOAP: teoría en `docs/` y un servicio de calculadora (Node.js + TypeScript + [node-soap](https://github.com/vpulim/node-soap)).

## Uso
```bash
npm install
npm run calc:server   # http://localhost:8000/calculator?wsdl
npm run calc:client   # en otra terminal
```

## Contenido
- `docs/01-que-es-soap.md`, `02-anatomia-mensaje.md`, `03-wsdl-y-xsd.md`
- `src/calculator/` — WSDL escrito a mano, servidor y cliente (Add, Subtract, Divide con SOAP Fault)
