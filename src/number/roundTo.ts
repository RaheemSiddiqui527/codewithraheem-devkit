/**
 * Rounds a number to a specified number of decimal places using exponential notation
 * to avoid IEEE 754 floating-point inaccuracies (e.g. 1.005 rounding to 1.01).
 *
 * @param value The number to round.
 * @param decimals The number of decimal places (integer >= 0). Defaults to 0.
 * @returns The rounded number.
 * @throws {TypeError} If `value` is not a number or is `NaN`, or `decimals` is not a number.
 * @throws {RangeError} If `decimals` is not a non-negative integer.
 *
 * @example
 * ```ts
 * roundTo(1.005, 2); // 1.01 (native Math.round gives 1.00)
 * roundTo(123.456, 1); // 123.5
 * roundTo(123.456, 0); // 123
 * ```
 */
export function roundTo(value: number, decimals: number = 0): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError(`Expected a valid number for value, received ${value}`);
  }
  if (typeof decimals !== "number" || Number.isNaN(decimals)) {
    throw new TypeError(`Expected a number for decimals, received ${decimals}`);
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError(`Decimals must be a non-negative integer, received ${decimals}`);
  }

  if (!Number.isFinite(value)) {
    return value;
  }

  // Use scientific notation and sign preservation to avoid binary floating-point rounding errors
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  return sign * Number(Math.round(Number(`${abs}e${decimals}`)) + `e-${decimals}`);
}
