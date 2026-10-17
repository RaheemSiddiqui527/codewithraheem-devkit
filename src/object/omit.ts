/**
 * Creates an object composed of the own enumerable properties of `object` that are not omitted.
 *
 * @template T Type of source object.
 * @template K Keys to omit from `T`.
 * @param object The source object.
 * @param keys The property keys to omit.
 * @returns A new object without the specified properties.
 * @throws {TypeError} If `object` is not an object or `keys` is not an array.
 *
 * @example
 * ```ts
 * omit({ a: 1, b: "2", c: 3 }, ["b"]); // { a: 1, c: 3 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> {
  if (object === null || typeof object !== "object") {
    throw new TypeError(
      `Expected an object, received ${object === null ? "null" : typeof object}`
    );
  }
  if (!Array.isArray(keys)) {
    throw new TypeError(`Expected keys to be an array, received ${typeof keys}`);
  }

  const omitSet = new Set<unknown>(keys);
  const result = {} as Omit<T, K>;
  const ownKeys = Object.keys(object) as (keyof T)[];
  const forbidden = new Set(["__proto__", "constructor", "prototype"]);

  for (let i = 0; i < ownKeys.length; i++) {
    const key = ownKeys[i] as keyof T;
    if (typeof key === "string" && forbidden.has(key)) {
      continue;
    }
    if (!omitSet.has(key)) {
      (result as Record<keyof T, unknown>)[key] = object[key];
    }
  }

  return result;
}
