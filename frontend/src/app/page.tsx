"use client";

import { useMemo } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { RoutineIdeas } from "@/components/RoutineIdeas";
import { TodaySummary } from "@/components/TodaySummary";
import { TaskDraft, TodayTask, useTasks } from "@/hooks/useTasks";

function sortForFocus(tasks: TodayTask[]): TodayTask[] {
  const pinned = tasks.filter((item) => item.task.pinned);
  const others = tasks.filter((item) => !item.task.pinned);
  return [...pinned, ...others];
}

export default function Home() {
  const { todaysTasks, addTask, toggleCompletion, removeTask, updateTask, resetCompletions, clearAllTasks } =
    useTasks();

  const orderedTasks = useMemo(() => sortForFocus(todaysTasks), [todaysTasks]);

  const handleCreate = (draft: TaskDraft) => {
    addTask({ ...draft, notes: draft.notes?.trim() ?? "" });
  };

  const handleQuickAdd = (draft: TaskDraft) => {
    handleCreate({ ...draft, title: draft.title });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 pb-16 pt-10 sm:px-8">
      <TodaySummary tasks={orderedTasks} onReset={resetCompletions} onClearAll={clearAllTasks} />

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <TaskList
          tasks={orderedTasks}
          onToggle={toggleCompletion}
          onRemove={removeTask}
          onPin={(id, pinned) => updateTask(id, { pinned })}
        />

        <div className="space-y-6">
          <TaskForm onCreate={handleCreate} />
          <RoutineIdeas onAdd={handleQuickAdd} />
        </div>
      </div>
    </main>
  );
}
