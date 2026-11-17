# Test SOAP

PoC para aprender SOAP: teoría en `docs/` y dos servicios de ejemplo (calculadora y biblioteca) con Node.js + TypeScript + [node-soap](https://github.com/vpulim/node-soap).

## Requisitos
Node.js 20+ y npm.

## Uso
```bash
npm install

# Calculadora (puerto 8000)
npm run calc:server   # http://localhost:8000/calculator?wsdl
npm run calc:client   # en otra terminal

# Biblioteca (puerto 8001, requiere header Token = "secret-token")
npm run lib:server    # http://localhost:8001/library?wsdl
npm run lib:client

npm test              # vitest: levanta ambos servicios en puertos aleatorios
npm run typecheck
```

## Teoría (léela en orden)
1. [Qué es SOAP](docs/01-que-es-soap.md)
2. [Anatomía de un mensaje](docs/02-anatomia-mensaje.md)
3. [WSDL y XSD](docs/03-wsdl-y-xsd.md)
4. [Faults y headers](docs/04-faults-y-headers.md)
5. [Buenas prácticas](docs/05-buenas-practicas.md)

## Código
| Ruta | Qué enseña |
|------|------------|
| `src/calculator/` | WSDL a mano, operaciones simples, SOAP Fault (`/0`) |
| `src/library/` | Tipos complejos, listas, CRUD, header `Token`, Faults 401/404 |

Probar a mano con curl: ver [lección 02](docs/02-anatomia-mensaje.md).
