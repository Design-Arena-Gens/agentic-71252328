"use client";

import { useMemo } from "react";
import { Task } from "@/types/task";
import { minutesUntil, todaysIsoDate, isWeekend, isWeekday, isCustomDay } from "@/utils/date";
import { usePersistentState } from "./usePersistentState";

export type TaskDraft = Omit<Task, "id" | "createdAt">;

const STORAGE_KEY = "daily-routine-tasks";

export interface TodayTask {
  task: Task;
  completed: boolean;
  minutesUntil: number;
}

function shouldRunToday(task: Task, today = new Date()): boolean {
  const dayIndex = today.getDay();
  switch (task.frequency) {
    case "daily":
      return true;
    case "weekdays":
      return isWeekday(today);
    case "weekends":
      return isWeekend(today);
    case "custom":
      return isCustomDay(dayIndex, task.customDays);
    case "once":
      return task.targetDate === todaysIsoDate(today);
    default:
      return true;
  }
}

function isCompletedToday(task: Task, todayLabel: string): boolean {
  return task.lastCompletedDate === todayLabel;
}

export function useTasks(today = new Date()) {
  const todayLabel = todaysIsoDate(today);
  const [tasks, setTasks] = usePersistentState<Task[]>(STORAGE_KEY, []);

  const todaysTasks = useMemo<TodayTask[]>(
    () =>
      tasks
        .filter((task) => shouldRunToday(task, today))
        .map((task) => ({
          task,
          completed: isCompletedToday(task, todayLabel),
          minutesUntil: minutesUntil(task.time, today),
        }))
        .sort((a, b) => {
          if (a.task.pinned && !b.task.pinned) return -1;
          if (!a.task.pinned && b.task.pinned) return 1;
          return a.task.time.localeCompare(b.task.time);
        }),
    [tasks, today, todayLabel],
  );

  const addTask = (draft: TaskDraft) => {
    setTasks((prev) => [
      ...prev,
      {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const toggleCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const completedToday = isCompletedToday(task, todayLabel);
        return {
          ...task,
          lastCompletedDate: completedToday ? undefined : todayLabel,
        };
      }),
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const resetCompletions = () => {
    setTasks((prev) => prev.map((task) => ({ ...task, lastCompletedDate: undefined })));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  return {
    tasks,
    todaysTasks,
    addTask,
    updateTask,
    removeTask,
    toggleCompletion,
    resetCompletions,
    clearAllTasks,
  };
}
