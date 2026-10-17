import { isValidDate } from "./isValidDate.js";

const MS_PER_DAY = 86_400_000;

/**
 * Calculates the number of full calendar days between two dates.
 *
 * Daylight-Saving and Timezone Semantics:
 * Local calendar days are not guaranteed to be exactly 24 hours (86,400,000 ms) long
 * due to Daylight Saving Time (DST) transitions, where a local day may span 23 or 25 hours.
 * To accurately compare calendar days rather than fixed elapsed 24-hour intervals,
 * this function normalizes both dates to UTC midnight using their respective local
 * calendar year, month, and day components (`Date.UTC(year, month, date)`).
 * This eliminates DST distortion and timezone offset discrepancies.
 *
 * Returns a positive integer if `end` is after `start`, negative if `end` is before `start`,
 * and `0` if both dates fall on the same local calendar day.
 *
 * Does not mutate either input date.
 *
 * @param start The start date.
 * @param end The end date.
 * @returns The signed number of whole calendar days between `start` and `end`.
 * @throws {TypeError} If either `start` or `end` is not a valid Date instance.
 *
 * @example
 * ```ts
 * const d1 = new Date("2025-03-01T10:00:00");
 * const d2 = new Date("2025-03-05T18:00:00");
 * daysBetween(d1, d2); // 4
 * daysBetween(d2, d1); // -4
 * daysBetween(d1, d1); // 0
 * ```
 */
export function daysBetween(start: Date, end: Date): number {
  if (!isValidDate(start)) {
    throw new TypeError(
      `Expected a valid Date instance for start, received: ${String(start)}`
    );
  }
  if (!isValidDate(end)) {
    throw new TypeError(
      `Expected a valid Date instance for end, received: ${String(end)}`
    );
  }

  // Normalize to UTC midnight based on local date parts to prevent DST drift
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.round((utcEnd - utcStart) / MS_PER_DAY);
}
