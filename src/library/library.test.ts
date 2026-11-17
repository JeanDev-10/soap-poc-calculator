import type { AddressInfo } from 'net';
import type http from 'http';
import * as soap from 'soap';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, VALID_TOKEN } from './server';

const NS = 'http://devnova.com/library';
let server: http.Server;
let url: string;
let endpoint: string;

beforeAll(async () => {
  server = await startServer(0);
  const { port } = server.address() as AddressInfo;
  url = `http://localhost:${port}/library?wsdl`;
  endpoint = `http://localhost:${port}/library`;
});

afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

async function authedClient(token = VALID_TOKEN) {
  const client = await soap.createClientAsync(url, { endpoint });
  client.addSoapHeader(`<tns:Token xmlns:tns="${NS}">${token}</tns:Token>`);
  return client;
}

const faultText = (err: any) => err.root.Envelope.Body.Fault.Reason.Text;

describe('Library SOAP', () => {
  it('rechaza llamadas sin token', async () => {
    const client = await soap.createClientAsync(url, { endpoint });
    const err = await client.ListBooksAsync({}).catch((e: any) => e);
    expect(faultText(err)).toBe('Token inválido o ausente');
  });

  it('rechaza un token incorrecto', async () => {
    const client = await authedClient('otro');
    const err = await client.ListBooksAsync({}).catch((e: any) => e);
    expect(faultText(err)).toBe('Token inválido o ausente');
  });

  it('CRUD completo', async () => {
    const client = await authedClient();

    const [created] = await client.CreateBookAsync({ title: 'Clean Code', author: 'Martin', year: 2008 });
    const id = created.book.id;
    expect(created.book).toMatchObject({ title: 'Clean Code', author: 'Martin' });

    const [got] = await client.GetBookAsync({ id });
    expect(got.book.title).toBe('Clean Code');

    const [updated] = await client.UpdateBookAsync({ id, title: 'Clean Code 2', author: 'Martin', year: 2009 });
    expect(updated.book.title).toBe('Clean Code 2');

    const [list] = await client.ListBooksAsync({});
    expect(list.book).toHaveLength(1);

    const [deleted] = await client.DeleteBookAsync({ id });
    expect(deleted.deleted).toBe(true);

    const err = await client.GetBookAsync({ id }).catch((e: any) => e);
    expect(faultText(err)).toBe(`Libro ${id} no encontrado`);
  });
});
