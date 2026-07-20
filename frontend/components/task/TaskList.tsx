import type { Task } from "@/types/task";
import TaskItem from "@/components/task/TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <ul
        aria-label="Tasks"
        className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"
      >
        <li className="list-none text-sm text-gray-500">
          No tasks yet. Add your first task below.
        </li>
      </ul>
    );
  }

  return (
    <ul aria-label="Tasks" className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
