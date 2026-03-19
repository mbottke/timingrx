import type { GestationalAgeDays } from "@/data/types";

export function gaToWeeksAndDays(ga: GestationalAgeDays): {
  weeks: number;
  days: number;
} {
  return {
    weeks: Math.floor(ga / 7),
    days: ga % 7,
  };
}

export function gaToDisplay(ga: GestationalAgeDays): string {
  const { weeks, days } = gaToWeeksAndDays(ga);
  return `${weeks}w${days}d`;
}

export function displayToGA(display: string): GestationalAgeDays {
  const match = display.match(/^(\d+)w(\d+)d$/);
  if (!match) throw new Error(`Invalid GA format: "${display}"`);
  return parseInt(match[1]) * 7 + parseInt(match[2]);
}

export function gaRangeToDisplay(
  earliest: GestationalAgeDays,
  latest: GestationalAgeDays
): string {
  if (earliest === latest) return gaToDisplay(earliest);
  return `${gaToDisplay(earliest)}\u2013${gaToDisplay(latest)}`;
}
