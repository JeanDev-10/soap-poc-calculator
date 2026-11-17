import http from 'http';
import fs from 'fs';
import path from 'path';
import * as soap from 'soap';

export const VALID_TOKEN = 'secret-token';

interface Book {
  id: number;
  title: string;
  author: string;
  year?: number;
}

type NewBook = Omit<Book, 'id'>;
type Headers = { Token?: string };

function fault(code: 'soap:Sender' | 'soap:Receiver', text: string, statusCode: number): never {
  throw { Fault: { Code: { Value: code }, Reason: { Text: text }, statusCode } };
}

function requireAuth(headers: Headers) {
  if (headers?.Token !== VALID_TOKEN) fault('soap:Sender', 'Token inválido o ausente', 401);
}

// El estado vive dentro de cada servicio para que cada servidor arranque limpio.
function createService() {
  const books = new Map<number, Book>();
  let nextId = 1;

  const getOrFail = (id: number): Book => {
    const book = books.get(id);
    if (!book) fault('soap:Sender', `Libro ${id} no encontrado`, 404);
    return book;
  };

  // Cada handler recibe (args, callback, headers); aquí usamos retorno síncrono.
  return {
    LibraryService: {
      LibraryPort: {
        CreateBook: (args: NewBook, _cb: unknown, headers: Headers) => {
          requireAuth(headers);
          const book: Book = { id: nextId++, ...args };
          books.set(book.id, book);
          return { book };
        },
        GetBook: ({ id }: { id: number }, _cb: unknown, headers: Headers) => {
          requireAuth(headers);
          return { book: getOrFail(id) };
        },
        ListBooks: (_args: unknown, _cb: unknown, headers: Headers) => {
          requireAuth(headers);
          return { book: [...books.values()] };
        },
        UpdateBook: ({ id, ...data }: Book, _cb: unknown, headers: Headers) => {
          requireAuth(headers);
          getOrFail(id);
          const book: Book = { id, ...data };
          books.set(id, book);
          return { book };
        },
        DeleteBook: ({ id }: { id: number }, _cb: unknown, headers: Headers) => {
          requireAuth(headers);
          getOrFail(id);
          return { deleted: books.delete(id) };
        },
      },
    },
  };
}

const wsdl = fs.readFileSync(path.join(__dirname, 'library.wsdl'), 'utf8');

/** Levanta el servicio en `port` (0 = puerto libre aleatorio). */
export function startServer(port: number): Promise<http.Server> {
  const server = http.createServer((_req, res) => {
    res.statusCode = 404;
    res.end('Not Found');
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      soap.listen(server, '/library', createService(), wsdl, () => resolve(server));
    });
  });
}
