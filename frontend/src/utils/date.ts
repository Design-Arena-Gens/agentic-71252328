const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

export function formatTodayLabel(date = new Date()): string {
  return dayFormatter.format(date);
}

export function minutesUntil(time: string, relativeTo = new Date()): number {
  const [hours, minutes] = time.split(":").map(Number);
  const target = new Date(relativeTo);
  target.setHours(hours, minutes, 0, 0);
  let diff = (target.getTime() - relativeTo.getTime()) / 60000;
  if (diff < -720) {
    diff += 24 * 60;
  }
  return Math.round(diff);
}

export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}

export function formatTimeLabel(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return timeFormatter.format(date);
}

export function todaysIsoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function isWeekend(date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isWeekday(date = new Date()): boolean {
  return !isWeekend(date);
}

export function isCustomDay(dayIndex: number, customDays?: number[]): boolean {
  if (!customDays || customDays.length === 0) return false;
  return customDays.includes(dayIndex);
}
