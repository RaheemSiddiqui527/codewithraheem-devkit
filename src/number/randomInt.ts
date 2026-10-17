/**
 * Generates a pseudo-random integer within the inclusive range `[min, max]`.
 * Supports an injected random generator for deterministic testing.
 *
 * @param min The minimum integer (inclusive).
 * @param max The maximum integer (inclusive).
 * @param random A function that returns a pseudo-random float in `[0, 1)`. Defaults to `Math.random`.
 * @returns An integer between `min` and `max` inclusive.
 * @throws {TypeError} If `min` or `max` is not an integer, or `random` is not a function.
 * @throws {RangeError} If `min` is greater than `max`.
 *
 * @example
 * ```ts
 * randomInt(1, 10); // integer between 1 and 10
 * randomInt(1, 10, () => 0); // 1 (deterministic)
 * randomInt(1, 10, () => 0.9999); // 10 (deterministic)
 * ```
 */
export function randomInt(
  min: number,
  max: number,
  random: () => number = Math.random
): number {
  if (
    typeof min !== "number" ||
    !Number.isInteger(min) ||
    typeof max !== "number" ||
    !Number.isInteger(max)
  ) {
    throw new TypeError("min and max must be valid safe integers");
  }
  if (min > max) {
    throw new RangeError(`min (${min}) cannot be greater than max (${max})`);
  }
  if (typeof random !== "function") {
    throw new TypeError(`Expected random to be a function, received ${typeof random}`);
  }

  const r = random();
  const normalized =
    typeof r === "number" && !Number.isNaN(r)
      ? Math.max(0, Math.min(r, 0.9999999999999999))
      : 0;
  return min + Math.floor(normalized * (max - min + 1));
}
