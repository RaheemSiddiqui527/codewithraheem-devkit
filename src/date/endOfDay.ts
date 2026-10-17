import { isValidDate } from "./isValidDate.js";

/**
 * Returns a new `Date` instance representing the end of the day (`23:59:59.999`)
 * for the given date in local time.
 *
 * This function is pure and does not mutate the original `Date` instance.
 *
 * @param date The date to query.
 * @returns A new `Date` instance set to the last millisecond of the local calendar day.
 * @throws {TypeError} If `date` is not a valid Date instance.
 *
 * @example
 * ```ts
 * const now = new Date("2025-06-15T15:30:45");
 * const end = endOfDay(now);
 * // end is 2025-06-15T23:59:59.999 in local time
 * ```
 */
export function endOfDay(date: Date): Date {
  if (!isValidDate(date)) {
    throw new TypeError(`Expected a valid Date instance, received: ${String(date)}`);
  }

  const result = new Date(date.getTime());
  result.setHours(23, 59, 59, 999);
  return result;
}
