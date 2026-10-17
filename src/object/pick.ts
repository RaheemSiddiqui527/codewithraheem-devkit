/**
 * Creates an object composed of the picked object properties.
 *
 * @template T Type of source object.
 * @template K Keys to pick from `T`.
 * @param object The source object.
 * @param keys The property keys to pick.
 * @returns A new object with only the picked properties.
 * @throws {TypeError} If `object` is not an object or `keys` is not an array.
 *
 * @example
 * ```ts
 * pick({ a: 1, b: "2", c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Pick<T, K> {
  if (object === null || typeof object !== "object") {
    throw new TypeError(
      `Expected an object, received ${object === null ? "null" : typeof object}`
    );
  }
  if (!Array.isArray(keys)) {
    throw new TypeError(`Expected keys to be an array, received ${typeof keys}`);
  }

  const result = {} as Pick<T, K>;
  const forbidden = new Set(["__proto__", "constructor", "prototype"]);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as K;
    if (typeof key === "string" && forbidden.has(key)) {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key];
    }
  }

  return result;
}
