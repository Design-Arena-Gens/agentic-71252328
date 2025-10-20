export type TaskFrequency = "daily" | "weekdays" | "weekends" | "custom" | "once";

export interface Task {
  id: string;
  title: string;
  time: string; // HH:MM in 24h format
  category: string;
  notes?: string;
  frequency: TaskFrequency;
  customDays?: number[]; // 0-6 (Sunday-Saturday)
  reminderOffset: number; // minutes before
  pinned: boolean;
  lastCompletedDate?: string;
  createdAt: string; // ISO timestamp
  targetDate?: string; // only for "once" tasks
}

export interface UpcomingTask extends Task {
  minutesUntil: number;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Wellness: "from-emerald-400/80 to-emerald-500/30",
  Work: "from-sky-400/80 to-sky-500/30",
  Home: "from-orange-400/80 to-orange-500/30",
  Learning: "from-purple-400/80 to-purple-500/30",
  Personal: "from-rose-400/80 to-rose-500/30",
};

export const FALLBACK_GRADIENT = "from-stone-400/80 to-stone-500/30";
