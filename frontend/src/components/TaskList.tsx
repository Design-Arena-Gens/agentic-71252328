"use client";

import { Fragment, useMemo, useState } from "react";
import { TodayTask } from "@/hooks/useTasks";
import { formatMinutes, formatTimeLabel } from "@/utils/date";

const segments = [
  { label: "Morning", startsAt: 5 * 60, endsAt: 12 * 60 },
  { label: "Afternoon", startsAt: 12 * 60, endsAt: 17 * 60 },
  { label: "Evening", startsAt: 17 * 60, endsAt: 21 * 60 },
  { label: "Night", startsAt: 21 * 60, endsAt: 24 * 60 + 5 * 60 },
];

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function statusColor(completed: boolean, minutesUntil: number) {
  if (completed) return "bg-emerald-400/20 text-emerald-300 border-emerald-500/40";
  if (minutesUntil < 0) return "bg-rose-400/10 text-rose-300 border-rose-500/40";
  if (minutesUntil <= 30) return "bg-amber-400/10 text-amber-200 border-amber-500/40";
  return "bg-zinc-800/60 text-zinc-300 border-zinc-700";
}

interface TaskListProps {
  tasks: TodayTask[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onPin: (id: string, pinned: boolean) => void;
}

export function TaskList({ tasks, onToggle, onRemove, onPin }: TaskListProps) {
  const [filter, setFilter] = useState<"all" | "focus" | "completed">("all");

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "completed":
        return tasks.filter((item) => item.completed);
      case "focus":
        return tasks.filter((item) => !item.completed).slice(0, 3);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const grouped = useMemo(() => {
    const groups = new Map<string, TodayTask[]>();
    segments.forEach((segment) => groups.set(segment.label, []));

    filteredTasks.forEach((item) => {
      const minutes = toMinutes(item.task.time);
      const segment = segments.find((block) => {
        if (block.label === "Night" && minutes < 5 * 60) return true;
        return minutes >= block.startsAt && minutes < block.endsAt;
      });
      const label = segment?.label ?? "Anytime";
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label)!.push(item);
    });

    return Array.from(groups.entries()).filter(([, items]) => items.length > 0);
  }, [filteredTasks]);

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Today&apos;s routine</h2>
        <div className="flex gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 p-1 text-sm text-zinc-300">
          {(
            [
              { label: "All", value: "all" },
              { label: "Focus", value: "focus" },
              { label: "Done", value: "completed" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              className={`rounded-full px-3 py-1 transition ${
                filter === option.value ? "bg-emerald-500/80 text-emerald-950" : "hover:bg-zinc-900"
              }`}
              onClick={() => setFilter(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {grouped.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-700/70 bg-zinc-950/60 p-10 text-center text-zinc-400">
            Nothing scheduled yet. Add a task to see it here.
          </div>
        )}

        {grouped.map(([label, items]) => (
          <Fragment key={label}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-200">{label}</h3>
              <span className="text-sm text-zinc-500">
                {items.filter((item) => item.completed).length} / {items.length} completed
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {items.map(({ task, completed, minutesUntil }) => (
                <article
                  key={task.id}
                  className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br ${
                    task.pinned ? "border-emerald-500/60" : "border-zinc-800"
                  } from-zinc-900/80 to-zinc-950/90 shadow-lg shadow-black/40`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 via-transparent to-black/40 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                          <span>{formatTimeLabel(task.time)}</span>
                          <span className="h-1 w-1 rounded-full bg-zinc-600" />
                          <span>{task.category}</span>
                          {task.notes && (
                            <span className="truncate text-zinc-500">{task.notes}</span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${statusColor(
                          completed,
                          minutesUntil,
                        )}`}
                      >
                        {completed ? "Completed" : minutesUntil < 0 ? "Missed" : formatMinutes(minutesUntil)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                        Remind {task.reminderOffset === 0 ? "at time" : `${task.reminderOffset} min early`}
                      </span>
                      <span className="rounded-full border border-zinc-700/60 bg-zinc-900/80 px-3 py-1 text-zinc-300">
                        {task.frequency}
                      </span>
                      {task.pinned && (
                        <span className="rounded-full border border-amber-400/40 bg-amber-400/20 px-3 py-1 text-amber-200">
                          Pinned
                        </span>
                      )}
                    </div>

                    <footer className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                      <button
                        onClick={() => onToggle(task.id)}
                        type="button"
                        className={`rounded-full px-4 py-2 font-medium transition ${
                          completed
                            ? "bg-zinc-900 text-emerald-300 hover:bg-zinc-800"
                            : "bg-emerald-500/90 text-emerald-950 hover:bg-emerald-400"
                        }`}
                      >
                        {completed ? "Undo" : "Mark done"}
                      </button>
                      <button
                        onClick={() => onPin(task.id, !task.pinned)}
                        type="button"
                        className="rounded-full border border-zinc-700 px-4 py-2 hover:border-zinc-500"
                      >
                        {task.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => onRemove(task.id)}
                        type="button"
                        className="rounded-full border border-transparent px-4 py-2 text-zinc-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export type { TodayTask };
