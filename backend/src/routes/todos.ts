import type { FastifyPluginAsync } from 'fastify';
import * as todoService from '../services/todo-service.js';

const todoRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    return await todoService.listTodos();
  });

  app.post('/', async (request, reply) => {
    const todo = await todoService.createTodo(request.body);
    return reply.code(201).send(todo);
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const todo = await todoService.updateCompletion(id, request.body);
    return reply.send(todo);
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await todoService.deleteTodo(id);
    return reply.code(204).send();
  });
};

export default todoRoutes;
