export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

function baseUrl(): string {
  return import.meta.env.VITE_API_URL ?? '';
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: string } };
    if (data?.error?.message) {
      return data.error.message;
    }
  } catch {
    /* ignore */
  }
  return res.statusText || 'Request failed';
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${baseUrl()}/todos`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as Todo[];
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${baseUrl()}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as Todo;
}

export async function patchTodo(id: string, completed: boolean): Promise<Todo> {
  const res = await fetch(`${baseUrl()}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as Todo;
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${baseUrl()}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}
