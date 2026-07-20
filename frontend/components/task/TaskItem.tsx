import type { Task } from "@/types/task";
import PriorityBadge from "@/components/task/PriorityBadge";

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const checkboxId = `task-${task.id}-completed`;

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <input
        id={checkboxId}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="h-4 w-4 shrink-0 rounded border-gray-300 text-gray-900 focus:ring-gray-300"
      />
      <label htmlFor={checkboxId} className="visually-hidden">
        Mark &quot;{task.title}&quot; as done
      </label>

      <span
        className={`flex-1 text-sm ${
          task.completed ? "text-gray-400 line-through" : "text-gray-900"
        }`}
      >
        {task.title}
      </span>

      <PriorityBadge priority={task.priority} />

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
        className="rounded-md px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        Delete
      </button>
    </li>
  );
}
