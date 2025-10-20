"use client";

import { TaskDraft } from "@/hooks/useTasks";

const ideas: TaskDraft[] = [
  {
    title: "Hydrate & vitamins",
    time: "08:00",
    category: "Wellness",
    frequency: "daily",
    reminderOffset: 5,
    notes: "Drink 500ml water",
    pinned: false,
  },
  {
    title: "Inbox zero",
    time: "15:00",
    category: "Work",
    frequency: "weekdays",
    reminderOffset: 10,
    notes: "15-minute email sweep",
    pinned: false,
  },
  {
    title: "Mindful break",
    time: "12:30",
    category: "Personal",
    frequency: "daily",
    reminderOffset: 0,
    notes: "5-minute breathing",
    pinned: false,
  },
  {
    title: "Reading",
    time: "21:30",
    category: "Learning",
    frequency: "daily",
    reminderOffset: 15,
    notes: "15 pages of a book",
    pinned: false,
  },
];

interface RoutineIdeasProps {
  onAdd: (draft: TaskDraft) => void;
}

export function RoutineIdeas({ onAdd }: RoutineIdeasProps) {
  return (
    <section className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-5 shadow-lg shadow-black/30">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Quick add suggestions</h2>
        <span className="text-xs uppercase tracking-wide text-zinc-500">Tap to add</span>
      </header>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ideas.map((idea) => (
          <button
            key={idea.title}
            onClick={() => onAdd(idea)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
            type="button"
          >
            <p className="text-base font-semibold text-white">{idea.title}</p>
            <p className="mt-1 text-sm text-zinc-400">
              {idea.category} • {idea.time}
            </p>
            {idea.notes && <p className="mt-2 text-xs text-zinc-500">{idea.notes}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}
