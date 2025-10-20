"use client";

import { TodayTask } from "@/hooks/useTasks";
import { formatMinutes, formatTimeLabel, formatTodayLabel } from "@/utils/date";

interface TodaySummaryProps {
  tasks: TodayTask[];
  onReset: () => void;
  onClearAll: () => void;
}

export function TodaySummary({ tasks, onReset, onClearAll }: TodaySummaryProps) {
  const total = tasks.length;
  const completed = tasks.filter((item) => item.completed).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const remaining = tasks.filter((item) => !item.completed).length;

  const upcoming = tasks
    .filter((item) => !item.completed && item.minutesUntil >= 0)
    .sort((a, b) => a.minutesUntil - b.minutesUntil)[0];

  const missed = tasks.filter((item) => !item.completed && item.minutesUntil < 0);

  return (
    <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-zinc-950 px-6 py-6 shadow-lg shadow-emerald-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-200">Today</p>
            <h1 className="text-3xl font-semibold text-white">{formatTodayLabel()}</h1>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-emerald-200">{completionRate}%</span>
            <span className="text-sm text-emerald-200/80">completion</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <p className="text-emerald-200/80">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-white">{completed}</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <p className="text-emerald-200/80">Remaining</p>
            <p className="mt-2 text-2xl font-semibold text-white">{remaining}</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <p className="text-emerald-200/80">Total planned</p>
            <p className="mt-2 text-2xl font-semibold text-white">{total}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <button
            onClick={onReset}
            type="button"
            className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-4 py-2 text-emerald-100 transition hover:bg-emerald-500/30"
          >
            Reset today
          </button>
          <button
            onClick={onClearAll}
            type="button"
            className="rounded-full border border-transparent px-4 py-2 text-emerald-100/80 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
          >
            Clear tasks
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-5 shadow-lg shadow-black/30">
          <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-400">Next up</h3>
          {upcoming ? (
            <div className="mt-3 space-y-1">
              <p className="text-lg font-semibold text-white">{upcoming.task.title}</p>
              <p className="text-sm text-zinc-400">
                {formatTimeLabel(upcoming.task.time)} • {upcoming.task.category}
              </p>
              <p className="text-sm text-emerald-200">
                Starts in {formatMinutes(upcoming.minutesUntil)}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">All caught up! No upcoming tasks.</p>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-5 shadow-lg shadow-black/30">
          <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-400">Missed today</h3>
          {missed.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {missed.slice(0, 3).map((item) => (
                <li key={item.task.id} className="flex items-center justify-between">
                  <span>{item.task.title}</span>
                  <span className="text-zinc-500">{formatTimeLabel(item.task.time)}</span>
                </li>
              ))}
              {missed.length > 3 && (
                <li className="text-xs text-zinc-500">+{missed.length - 3} more</li>
              )}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No missed tasks. Nice work.</p>
          )}
        </div>
      </div>
    </section>
  );
}
