import Fastify from 'fastify';
import cors from '@fastify/cors';
import todoRoutes from './routes/todos.js';
import { isAppError } from './lib/errors.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  app.setErrorHandler((error, request, reply) => {
    if (isAppError(error)) {
      return reply.status(error.statusCode).send(error.toJSON());
    }
    request.log.error(error);
    return reply.status(500).send({
      error: {
        code: 'BAD_REQUEST',
        message: 'Something went wrong',
      },
    });
  });

  await app.register(todoRoutes, { prefix: '/todos' });

  return app;
}
