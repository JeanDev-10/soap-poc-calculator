import { startServer } from './server';

const PORT = 8001;

startServer(PORT).then(() => {
  console.log(`Library SOAP listo: http://localhost:${PORT}/library?wsdl`);
});
