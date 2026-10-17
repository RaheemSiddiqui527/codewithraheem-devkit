/**
 * Checks if `value` is an empty object, collection, map, set, or string.
 *
 * Values considered empty:
 * - `null` and `undefined`
 * - Primitives without a length or size property (`boolean`, `number`, `bigint`, `symbol`)
 * - Strings and arrays with a `length` of `0`
 * - Maps and Sets with a `size` of `0`
 * - Objects with no enumerable own string-keyed properties
 *
 * @param value The value to check.
 * @returns `true` if `value` is empty, else `false`.
 *
 * @example
 * ```ts
 * isEmpty(null); // true
 * isEmpty(""); // true
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty(new Set()); // true
 * isEmpty([1, 2]); // false
 * isEmpty({ a: 1 }); // false
 * ```
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (ArrayBuffer.isView(value)) {
    return value.byteLength === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return true;
}
