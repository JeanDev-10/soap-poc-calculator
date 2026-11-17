import { startServer } from './server';

const PORT = 8000;

startServer(PORT).then(() => {
  console.log(`Calculator SOAP listo: http://localhost:${PORT}/calculator?wsdl`);
});
