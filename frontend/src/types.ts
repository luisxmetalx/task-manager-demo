// types.ts

export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}