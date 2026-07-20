import type { FormEvent } from "react";
import type { Priority } from "@/types/task";

const PRIORITIES = Array.from({ length: 10 }, (_, index) => index + 1);

type TaskFormProps = {
  onAddTask: (title: string, priority: Priority) => void;
};

export default function TaskForm({ onAddTask }: TaskFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      return;
    }

    const priority = Number(formData.get("priority")) as Priority;

    onAddTask(title, priority);
    form.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label
          htmlFor="task-title"
          className="mb-1.5 block text-sm font-medium text-gray-600"
        >
          Task
        </label>
        <input
          id="task-title"
          type="text"
          name="title"
          required
          placeholder="What needs to be done?"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="sm:w-32">
        <label
          htmlFor="task-priority"
          className="mb-1.5 block text-sm font-medium text-gray-600"
        >
          Priority
        </label>
        <select
          id="task-priority"
          name="priority"
          defaultValue={1}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        Add
      </button>
    </form>
  );
}
