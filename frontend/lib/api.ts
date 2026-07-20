import type { Priority, Task } from "@/types/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiTask = {
  id: number;
  title: string;
  completed: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

type TaskMutableFields = {
  title: string;
  completed: boolean;
  priority: Priority;
};

function mapApiTaskToTask(apiTask: ApiTask): Task {
  return {
    id: String(apiTask.id),
    title: apiTask.title,
    completed: apiTask.completed,
    priority: apiTask.priority as Priority,
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getTasks(): Promise<Task[]> {
  const apiTasks = await request<ApiTask[]>("/api/tasks");
  return apiTasks.map(mapApiTaskToTask);
}

export async function createTask(title: string, priority: Priority): Promise<Task> {
  const apiTask = await request<ApiTask>("/api/tasks", {
    method: "POST",
    body: JSON.stringify({ title, priority }),
  });
  return mapApiTaskToTask(apiTask);
}

export async function updateTask(
  id: string,
  updates: Partial<TaskMutableFields>,
): Promise<Task> {
  const apiTask = await request<ApiTask>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return mapApiTaskToTask(apiTask);
}

export async function deleteTask(id: string): Promise<void> {
  await request<void>(`/api/tasks/${id}`, { method: "DELETE" });
}
