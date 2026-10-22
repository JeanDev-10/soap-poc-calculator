import * as soap from 'soap';

const WSDL_URL = 'http://localhost:8000/calculator?wsdl';

async function main() {
  const client = await soap.createClientAsync(WSDL_URL);

  console.log('Operaciones disponibles (describe):');
  console.dir(client.describe(), { depth: 4 });

  const [add] = await client.AddAsync({ a: 5, b: 3 });
  console.log('\nAdd(5, 3) =', add.result);
  console.log('Request XML :', client.lastRequest);
  console.log('Response XML:', client.lastResponse);

  const [divide] = await client.DivideAsync({ a: 10, b: 4 });
  console.log('\nDivide(10, 4) =', divide.result);

  try {
    await client.DivideAsync({ a: 1, b: 0 });
  } catch (err: any) {
    console.log('\nFault recibido:', err.root?.Envelope?.Body?.Fault ?? err.message);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
