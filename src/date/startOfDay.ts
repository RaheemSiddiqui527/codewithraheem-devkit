import { isValidDate } from "./isValidDate.js";

/**
 * Returns a new `Date` instance representing the start of the day (`00:00:00.000`)
 * for the given date in local time.
 *
 * This function is pure and does not mutate the original `Date` instance.
 *
 * @param date The date to query.
 * @returns A new `Date` instance set to midnight local time.
 * @throws {TypeError} If `date` is not a valid Date instance.
 *
 * @example
 * ```ts
 * const now = new Date("2025-06-15T15:30:45");
 * const start = startOfDay(now);
 * // start is 2025-06-15T00:00:00.000 in local time
 * ```
 */
export function startOfDay(date: Date): Date {
  if (!isValidDate(date)) {
    throw new TypeError(`Expected a valid Date instance, received: ${String(date)}`);
  }

  const result = new Date(date.getTime());
  result.setHours(0, 0, 0, 0);
  return result;
}
