export type Priority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export type StatusFilter = "all" | "done" | "undone";

export type SortOrder = "asc" | "desc";
