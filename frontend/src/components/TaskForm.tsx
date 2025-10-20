"use client";

import { FormEvent, useMemo, useState } from "react";
import { TaskDraft } from "@/hooks/useTasks";
import { TaskFrequency } from "@/types/task";

const DEFAULT_REMINDER = 10;

const categories = ["Wellness", "Work", "Home", "Learning", "Personal"];

const templates: Array<Omit<TaskDraft, "id" | "createdAt">> = [
  {
    title: "Wake up & stretch",
    time: "07:00",
    category: "Wellness",
    frequency: "daily",
    reminderOffset: DEFAULT_REMINDER,
    notes: "5 minute stretch + water",
    pinned: true,
  },
  {
    title: "Focus block",
    time: "09:00",
    category: "Work",
    frequency: "weekdays",
    reminderOffset: DEFAULT_REMINDER,
    notes: "Deep work session",
    pinned: false,
  },
  {
    title: "Daily review",
    time: "20:30",
    category: "Personal",
    frequency: "daily",
    reminderOffset: DEFAULT_REMINDER,
    notes: "Reflect & plan tomorrow",
    pinned: false,
  },
];

const templateLabels = ["Morning", "Workday", "Evening"];

type TemplateOption = { label: string; draft: TaskDraft };

interface TaskFormProps {
  onCreate: (draft: TaskDraft) => void;
}

export function TaskForm({ onCreate }: TaskFormProps) {
  const [form, setForm] = useState<TaskDraft>({
    title: "",
    time: "07:00",
    category: categories[0],
    frequency: "daily",
    reminderOffset: DEFAULT_REMINDER,
    notes: "",
    pinned: false,
  });
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [targetDate, setTargetDate] = useState<string>("");

  const templateOptions = useMemo<TemplateOption[]>(
    () =>
      templates.map((draft, index) => ({
        label: templateLabels[index],
        draft: { ...draft },
      })),
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft: TaskDraft = {
      ...form,
      customDays: form.frequency === "custom" ? customDays : undefined,
      targetDate: form.frequency === "once" ? targetDate : undefined,
    };
    onCreate(draft);
    setForm((prev) => ({ ...prev, title: "", notes: "" }));
  };

  const applyTemplate = (draft: TaskDraft) => {
    setForm(draft);
    setCustomDays([]);
    setTargetDate("");
  };

  const toggleCustomDay = (dayIndex: number) => {
    setCustomDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex],
    );
  };

  const updateField = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur px-6 py-5 shadow-lg shadow-black/30">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Plan a new routine block</h2>
          <p className="text-sm text-zinc-400">Create tasks and reminders tailored to your day.</p>
        </div>
        <div className="hidden gap-2 md:flex">
          {templateOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => applyTemplate(option.draft)}
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Task name
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Morning run, journaling..."
            required
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Time
          <input
            type="time"
            value={form.time}
            onChange={(event) => updateField("time", event.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Category
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Reminder
          <select
            value={form.reminderOffset}
            onChange={(event) => updateField("reminderOffset", Number(event.target.value))}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {[0, 5, 10, 15, 30, 60].map((offset) => (
              <option key={offset} value={offset}>
                {offset === 0 ? "At time" : `${offset} minutes before`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Optional context or links"
            className="min-h-[72px] rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>

        <fieldset className="flex flex-wrap gap-3 md:col-span-2">
          <legend className="text-sm text-zinc-400">Frequency</legend>
          {(["daily", "weekdays", "weekends", "custom", "once"] as TaskFrequency[]).map((frequency) => (
            <button
              key={frequency}
              type="button"
              onClick={() => updateField("frequency", frequency)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                form.frequency === frequency
                  ? "bg-emerald-500/90 text-emerald-950 shadow shadow-emerald-500/40"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
              }`}
            >
              {frequency}
            </button>
          ))}
        </fieldset>

        {form.frequency === "custom" && (
          <div className="md:col-span-2">
            <div className="text-sm text-zinc-400">Days</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {"SMTWTFS".split("").map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleCustomDay(index)}
                  className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                    customDays.includes(index)
                      ? "bg-emerald-500/90 text-emerald-950 shadow shadow-emerald-500/40"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {form.frequency === "once" && (
          <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
            Date
            <input
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              required
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>
        )}

        <label className="flex items-center gap-2 text-sm text-zinc-300 md:col-span-2">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(event) => updateField("pinned", event.target.checked)}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/40"
          />
          Pin to top
        </label>

        <div className="mt-2 flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 md:hidden">
            {templateOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => applyTemplate(option.draft)}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="flex-1 rounded-full bg-emerald-500/90 px-6 py-3 text-base font-semibold text-emerald-950 transition hover:bg-emerald-400 md:flex-none"
          >
            Add to routine
          </button>
        </div>
      </form>
    </section>
  );
}
