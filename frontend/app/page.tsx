"use client";

import { useEffect, useMemo, useState } from "react";
import TaskSearch from "@/components/task/TaskSearch";
import TaskFilters from "@/components/task/TaskFilters";
import TaskSort from "@/components/task/TaskSort";
import TaskList from "@/components/task/TaskList";
import TaskForm from "@/components/task/TaskForm";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Priority, SortOrder, StatusFilter, Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    let isMounted = true;

    getTasks()
      .then((fetchedTasks) => {
        if (isMounted) setTasks(fetchedTasks);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  async function refreshTasks() {
    const fetchedTasks = await getTasks();
    setTasks(fetchedTasks);
  }

  async function handleAddTask(title: string, priority: Priority) {
    await createTask(title, priority);
    await refreshTasks();
  }

  async function handleToggleComplete(id: string) {
    const task = tasks.find((currentTask) => currentTask.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
    await refreshTasks();
  }

  async function handleDeleteTask(id: string) {
    await deleteTask(id);
    await refreshTasks();
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
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <TaskList
              tasks={visibleTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          )}
        </section>

        <section aria-label="Add a new task">
          <TaskForm onAddTask={handleAddTask} />
        </section>
      </div>
    </main>
  );
}
