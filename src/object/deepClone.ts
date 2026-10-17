const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Creates a deep copy of the given value.
 *
 * Supported types:
 * - Primitives (`string`, `number`, `boolean`, `bigint`, `null`, `undefined`, `symbol`)
 * - Plain objects
 * - Arrays
 * - `Date` instances
 * - `RegExp` instances
 * - `Map` and `Set` instances
 * - `ArrayBuffer` and TypedArrays (`Uint8Array`, `Int32Array`, etc.)
 *
 * Types copied by reference:
 * - Functions
 * - Promises
 * - WeakMap, WeakSet
 * - Error instances
 *
 * Handles circular references safely using an internal `WeakMap`.
 * Automatically prevents prototype pollution.
 *
 * @template T Type of value to clone.
 * @param value The value to clone.
 * @returns A deep clone of the input value.
 *
 * @example
 * ```ts
 * const original = { user: { name: "Raheem", date: new Date() } };
 * const copy = deepClone(original);
 * copy.user.name = "Updated";
 * console.log(original.user.name); // "Raheem"
 * ```
 */
export function deepClone<T>(value: T): T {
  const seen = new WeakMap<object, unknown>();

  function cloneInternal(val: unknown): unknown {
    if (val === null || typeof val !== "object") {
      return val;
    }

    // Check for circular reference
    if (seen.has(val)) {
      return seen.get(val);
    }

    // Date
    if (val instanceof Date) {
      return new Date(val.getTime());
    }

    // RegExp
    if (val instanceof RegExp) {
      return new RegExp(val.source, val.flags);
    }

    // ArrayBuffer
    if (val instanceof ArrayBuffer) {
      return val.slice(0);
    }

    // TypedArray (Uint8Array, Int32Array, etc.) and DataView
    if (ArrayBuffer.isView(val)) {
      if (val instanceof DataView) {
        const bufferCopy = val.buffer.slice(
          val.byteOffset,
          val.byteOffset + val.byteLength
        );
        return new DataView(bufferCopy as ArrayBuffer);
      }
      const TypedArrayCtor = val.constructor as {
        new (source: ArrayBufferView): ArrayBufferView;
      };
      return new TypedArrayCtor(val);
    }

    // Map
    if (val instanceof Map) {
      const copyMap = new Map();
      seen.set(val, copyMap);
      val.forEach((item, key) => {
        copyMap.set(cloneInternal(key), cloneInternal(item));
      });
      return copyMap;
    }

    // Set
    if (val instanceof Set) {
      const copySet = new Set();
      seen.set(val, copySet);
      val.forEach((item) => {
        copySet.add(cloneInternal(item));
      });
      return copySet;
    }

    // Array
    if (Array.isArray(val)) {
      const copyArr: unknown[] = [];
      seen.set(val, copyArr);
      for (let i = 0; i < val.length; i++) {
        copyArr[i] = cloneInternal(val[i]);
      }
      return copyArr;
    }

    // Functions, Errors, Promises: return by reference
    if (typeof val === "function" || val instanceof Error || val instanceof Promise) {
      return val;
    }

    // Plain or custom object
    const proto = Object.getPrototypeOf(val);
    const copyObj = Object.create(
      proto === Object.prototype || proto === null ? proto : Object.prototype
    );
    seen.set(val, copyObj);

    const keys = Reflect.ownKeys(val);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      if (typeof key === "string" && FORBIDDEN_KEYS.has(key)) {
        continue;
      }
      const desc = Object.getOwnPropertyDescriptor(val, key);
      if (desc && (desc.enumerable || typeof key === "symbol")) {
        copyObj[key] = cloneInternal((val as Record<PropertyKey, unknown>)[key]);
      }
    }

    return copyObj;
  }

  return cloneInternal(value) as T;
}
