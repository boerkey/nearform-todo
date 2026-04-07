import { useCallback, useEffect, useState, type FormEvent } from 'react';
import * as api from './api/client.js';
import type { Todo } from './api/client.js';
import { EmptyState } from './components/EmptyState.js';
import { TodoList } from './components/TodoList.js';

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoadError(null);
    try {
      const list = await api.fetchTodos();
      setTodos(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title cannot be empty');
      return;
    }
    if (trimmed.length > 255) {
      setError('Title must be at most 255 characters');
      return;
    }
    try {
      const created = await api.createTodo(trimmed);
      setTodos((prev) => [created, ...prev]);
      setTitle('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create todo');
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    setError(null);
    try {
      const updated = await api.patchTodo(id, completed);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update todo');
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete todo');
    }
  }

  if (loading) {
    return <p>Loading…</p>;
  }

  return (
    <main>
      <h1>Todos</h1>
      {loadError ? <div className="banner-error">Could not reach server: {loadError}</div> : null}

      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">New todo</label>
        <div>
          <input
            id="new-todo"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
            autoComplete="off"
          />
          <button type="submit">Add</button>
        </div>
      </form>
      {error ? <p className="error">{error}</p> : null}

      {todos.length === 0 ? <EmptyState /> : <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />}
    </main>
  );
}
