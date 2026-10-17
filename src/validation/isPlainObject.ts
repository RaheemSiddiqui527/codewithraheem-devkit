/**
 * Checks if a value is a plain object created by `{}` or `Object.create(null)`.
 * Returns `false` for null, arrays, functions, dates, regexes, class instances, etc.
 *
 * @param value The value to inspect.
 * @returns `true` if `value` is a plain object, else `false`.
 *
 * @example
 * ```ts
 * isPlainObject({}); // true
 * isPlainObject({ a: 1 }); // true
 * isPlainObject(Object.create(null)); // true
 * isPlainObject([1, 2]); // false
 * isPlainObject(new Date()); // false
 * isPlainObject(null); // false
 * ```
 */
export function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}
