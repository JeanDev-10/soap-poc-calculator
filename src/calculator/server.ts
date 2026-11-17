import http from 'http';
import fs from 'fs';
import path from 'path';
import * as soap from 'soap';

interface Operands {
  a: number;
  b: number;
}

// Estructura: Service (name) -> Port (name) -> Operation, igual que en el WSDL.
const service = {
  CalculatorService: {
    CalculatorPort: {
      Add: ({ a, b }: Operands) => ({ result: a + b }),
      Subtract: ({ a, b }: Operands) => ({ result: a - b }),
      Divide: ({ a, b }: Operands) => {
        if (b === 0) {
          // Lanzar un objeto con "Fault" devuelve un SOAP Fault al cliente.
          throw {
            Fault: {
              Code: { Value: 'soap:Sender' },
              Reason: { Text: 'No se puede dividir por cero' },
              statusCode: 500,
            },
          };
        }
        return { result: a / b };
      },
    },
  },
};

const wsdl = fs.readFileSync(path.join(__dirname, 'calculator.wsdl'), 'utf8');

/** Levanta el servicio en `port` (0 = puerto libre aleatorio). */
export function startServer(port: number): Promise<http.Server> {
  const server = http.createServer((_req, res) => {
    res.statusCode = 404;
    res.end('Not Found');
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      soap.listen(server, '/calculator', service, wsdl, () => resolve(server));
    });
  });
}
