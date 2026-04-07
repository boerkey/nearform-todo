import type { Todo } from '../api/client.js';

type Props = {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
          aria-label={`Mark ${todo.title} ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
      </label>
      <button type="button" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`}>
        Delete
      </button>
    </li>
  );
}
