import http from 'http';
import fs from 'fs';
import path from 'path';
import * as soap from 'soap';

const PORT = 8000;

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

const server = http.createServer((_req, res) => {
  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  soap.listen(server, '/calculator', service, wsdl, () => {
    console.log(`Calculator SOAP listo: http://localhost:${PORT}/calculator?wsdl`);
  });
});
