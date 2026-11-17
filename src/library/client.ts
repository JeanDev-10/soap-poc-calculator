import * as soap from 'soap';

const WSDL_URL = 'http://localhost:8001/library?wsdl';
const NS = 'http://devnova.com/library';

function faultOf(err: any) {
  return err.root?.Envelope?.Body?.Fault ?? err.message;
}

async function main() {
  const client = await soap.createClientAsync(WSDL_URL);

  // Sin token: el servidor responde con un Fault.
  try {
    await client.ListBooksAsync({});
  } catch (err) {
    console.log('Sin token ->', faultOf(err));
  }

  // Con token en el SOAP Header.
  client.addSoapHeader(`<tns:Token xmlns:tns="${NS}">secret-token</tns:Token>`);

  const [created] = await client.CreateBookAsync({ title: 'Clean Code', author: 'Robert C. Martin', year: 2008 });
  console.log('Creado:', created.book);
  await client.CreateBookAsync({ title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', year: 1999 });

  const [list] = await client.ListBooksAsync({});
  console.log('Lista:', list.book);

  const [updated] = await client.UpdateBookAsync({ id: 1, title: 'Clean Code (2nd)', author: 'Robert C. Martin', year: 2009 });
  console.log('Actualizado:', updated.book);

  const [deleted] = await client.DeleteBookAsync({ id: 2 });
  console.log('Eliminado:', deleted.deleted);

  try {
    await client.GetBookAsync({ id: 99 });
  } catch (err) {
    console.log('Libro inexistente ->', faultOf(err));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
