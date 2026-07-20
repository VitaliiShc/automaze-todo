"use client";

import { useMemo, useState } from "react";
import TaskSearch from "@/components/task/TaskSearch";
import TaskFilters from "@/components/task/TaskFilters";
import TaskSort from "@/components/task/TaskSort";
import TaskList from "@/components/task/TaskList";
import TaskForm from "@/components/task/TaskForm";
import type { Priority, SortOrder, StatusFilter, Task } from "@/types/task";

// Seed data for local state. Will be replaced by real data fetching in a future sprint.
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Set up project repository",
    completed: true,
    priority: 2,
    createdAt: "2026-07-18T09:00:00.000Z",
    updatedAt: "2026-07-18T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Design database schema",
    completed: false,
    priority: 6,
    createdAt: "2026-07-19T10:30:00.000Z",
    updatedAt: "2026-07-19T10:30:00.000Z",
  },
  {
    id: "3",
    title: "Implement authentication",
    completed: false,
    priority: 9,
    createdAt: "2026-07-19T14:15:00.000Z",
    updatedAt: "2026-07-19T14:15:00.000Z",
  },
  {
    id: "4",
    title: "Write unit tests",
    completed: false,
    priority: 4,
    createdAt: "2026-07-20T08:00:00.000Z",
    updatedAt: "2026-07-20T08:00:00.000Z",
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "done" ? task.completed : !task.completed);

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) =>
      sortOrder === "asc" ? a.priority - b.priority : b.priority - a.priority,
    );
  }, [tasks, search, statusFilter, sortOrder]);

  function handleAddTask(title: string, priority: Priority) {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  function handleToggleComplete(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task,
      ),
    );
  }

  function handleDeleteTask(id: string) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  return (
    <main className="flex flex-1 justify-center bg-gray-50 px-4 py-10 sm:py-16">
      <div className="flex w-full max-w-175 flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            TODO App
          </h1>
        </header>

        <section aria-label="Search and filters" className="flex flex-col gap-4">
          <TaskSearch value={search} onChange={setSearch} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TaskFilters value={statusFilter} onChange={setStatusFilter} />
            <TaskSort value={sortOrder} onChange={setSortOrder} />
          </div>
        </section>

        <section aria-label="Tasks">
          <TaskList
            tasks={visibleTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        </section>

        <section aria-label="Add a new task">
          <TaskForm onAddTask={handleAddTask} />
        </section>
      </div>
    </main>
  );
}
