import type { AddressInfo } from 'net';
import type http from 'http';
import * as soap from 'soap';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from './server';

let server: http.Server;
let client: soap.Client;

beforeAll(async () => {
  server = await startServer(0);
  const { port } = server.address() as AddressInfo;
  client = await soap.createClientAsync(`http://localhost:${port}/calculator?wsdl`, {
    endpoint: `http://localhost:${port}/calculator`,
  });
});

afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

describe('Calculator SOAP', () => {
  it('suma', async () => {
    const [res] = await client.AddAsync({ a: 5, b: 3 });
    expect(res.result).toBe(8);
  });

  it('resta', async () => {
    const [res] = await client.SubtractAsync({ a: 5, b: 3 });
    expect(res.result).toBe(2);
  });

  it('divide', async () => {
    const [res] = await client.DivideAsync({ a: 10, b: 4 });
    expect(res.result).toBe(2.5);
  });

  it('devuelve un Fault al dividir por cero', async () => {
    const err: any = await client.DivideAsync({ a: 1, b: 0 }).catch((e: any) => e);
    expect(err.root.Envelope.Body.Fault.Reason.Text).toBe('No se puede dividir por cero');
  });

  it('describe expone las 3 operaciones', () => {
    const ops = Object.keys(client.describe().CalculatorService.CalculatorPort);
    expect(ops).toEqual(['Add', 'Subtract', 'Divide']);
  });
});
