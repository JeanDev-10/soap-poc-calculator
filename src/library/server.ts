import http from 'http';
import fs from 'fs';
import path from 'path';
import * as soap from 'soap';

const PORT = 8001;
const VALID_TOKEN = 'secret-token';

interface Book {
  id: number;
  title: string;
  author: string;
  year?: number;
}

type NewBook = Omit<Book, 'id'>;

const books = new Map<number, Book>();
let nextId = 1;

function fault(code: 'soap:Sender' | 'soap:Receiver', text: string, statusCode: number): never {
  throw { Fault: { Code: { Value: code }, Reason: { Text: text }, statusCode } };
}

function requireAuth(headers: { Token?: string }) {
  if (headers?.Token !== VALID_TOKEN) fault('soap:Sender', 'Token inválido o ausente', 401);
}

function getOrFail(id: number): Book {
  const book = books.get(id);
  if (!book) fault('soap:Sender', `Libro ${id} no encontrado`, 404);
  return book;
}

// Cada handler recibe (args, callback, headers); aquí usamos retorno síncrono.
const service = {
  LibraryService: {
    LibraryPort: {
      CreateBook: (args: NewBook, _cb: unknown, headers: { Token?: string }) => {
        requireAuth(headers);
        const book: Book = { id: nextId++, ...args };
        books.set(book.id, book);
        return { book };
      },
      GetBook: ({ id }: { id: number }, _cb: unknown, headers: { Token?: string }) => {
        requireAuth(headers);
        return { book: getOrFail(id) };
      },
      ListBooks: (_args: unknown, _cb: unknown, headers: { Token?: string }) => {
        requireAuth(headers);
        return { book: [...books.values()] };
      },
      UpdateBook: ({ id, ...data }: Book, _cb: unknown, headers: { Token?: string }) => {
        requireAuth(headers);
        getOrFail(id);
        const book: Book = { id, ...data };
        books.set(id, book);
        return { book };
      },
      DeleteBook: ({ id }: { id: number }, _cb: unknown, headers: { Token?: string }) => {
        requireAuth(headers);
        getOrFail(id);
        return { deleted: books.delete(id) };
      },
    },
  },
};

const wsdl = fs.readFileSync(path.join(__dirname, 'library.wsdl'), 'utf8');

const server = http.createServer((_req, res) => {
  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  soap.listen(server, '/library', service, wsdl, () => {
    console.log(`Library SOAP listo: http://localhost:${PORT}/library?wsdl`);
  });
});
