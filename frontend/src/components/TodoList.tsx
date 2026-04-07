import type { Todo } from '../api/client.js';
import { TodoItem } from './TodoItem.js';

type Props = {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

export function TodoList({ todos, onToggle, onDelete }: Props) {
  return (
    <ul aria-label="Todo list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
