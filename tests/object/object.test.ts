import { describe, it, expect } from "vitest";
import { pick, omit, isEmpty, getPath, deepClone } from "../../src/object/index.js";

describe("Object Utilities", () => {
  describe("pick", () => {
    it("picks only the specified properties from an object", () => {
      const obj = { a: 1, b: "two", c: true, d: [1] };
      expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: true });
    });

    it("ignores keys that do not exist on the target object", () => {
      const obj = { a: 1 };
      // @ts-expect-error testing missing key
      expect(pick(obj, ["a", "nonExistent"])).toEqual({ a: 1 });
    });

    it("guards against prototype pollution keys", () => {
      const obj = { a: 1 };
      // @ts-expect-error testing prototype injection
      const result = pick(obj, ["__proto__", "constructor", "prototype", "a"]);
      expect(result).toEqual({ a: 1 });
      expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(false);
    });

    it("throws TypeError if object is null or not an object", () => {
      // @ts-expect-error testing invalid arguments
      expect(() => pick(null, ["a"])).toThrow(TypeError);
      // @ts-expect-error testing invalid arguments
      expect(() => pick(123, ["a"])).toThrow(TypeError);
    });

    it("throws TypeError if keys is not an array", () => {
      // @ts-expect-error testing invalid arguments
      expect(() => pick({ a: 1 }, "a")).toThrow(TypeError);
    });
  });

  describe("omit", () => {
    it("omits specified properties from an object", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ["b"])).toEqual({ a: 1, c: 3 });
    });

    it("returns a copy of the object if no matching keys", () => {
      const obj = { a: 1 };
      // @ts-expect-error testing non-existent key
      expect(omit(obj, ["x"])).toEqual({ a: 1 });
    });

    it("guards against prototype pollution", () => {
      const obj = { a: 1, constructor: "polluted" };
      // @ts-expect-error testing prototype keys
      const res = omit(obj, ["a"]);
      expect(res).toEqual({});
    });

    it("throws TypeError if object is null or not an object", () => {
      // @ts-expect-error testing invalid arguments
      expect(() => omit(null, ["a"])).toThrow(TypeError);
      // @ts-expect-error testing invalid arguments
      expect(() => omit("not-object", ["a"])).toThrow(TypeError);
    });

    it("throws TypeError if keys is not an array", () => {
      // @ts-expect-error testing invalid arguments
      expect(() => omit({ a: 1 }, "a")).toThrow(TypeError);
    });
  });

  describe("isEmpty", () => {
    it("identifies null and undefined as empty", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it("identifies primitives without size/length as empty", () => {
      expect(isEmpty(true)).toBe(true);
      expect(isEmpty(false)).toBe(true);
      expect(isEmpty(0)).toBe(true);
      expect(isEmpty(42)).toBe(true);
      expect(isEmpty(Symbol("sym"))).toBe(true);
      expect(isEmpty(100n)).toBe(true);
    });

    it("identifies strings and arrays correctly", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(false);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1])).toBe(false);
    });

    it("identifies Maps and Sets correctly", () => {
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(new Map([["k", "v"]]))).toBe(false);
      expect(isEmpty(new Set())).toBe(true);
      expect(isEmpty(new Set([1]))).toBe(false);
    });

    it("identifies plain objects and TypedArrays correctly", () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(new Uint8Array(0))).toBe(true);
      expect(isEmpty(new Uint8Array(1))).toBe(false);
    });
  });

  describe("getPath", () => {
    const data = {
      user: {
        profile: {
          name: "Raheem",
          tags: ["admin", "dev"],
          location: null,
        },
      },
      "dotted.key": 99,
    };

    it("retrieves values using dot notation string paths", () => {
      expect(getPath(data, "user.profile.name")).toBe("Raheem");
    });

    it("retrieves values using bracket array notation string paths", () => {
      expect(getPath(data, "user.profile.tags[0]")).toBe("admin");
      expect(getPath(data, "user.profile.tags[1]")).toBe("dev");
    });

    it("retrieves values using array paths", () => {
      expect(getPath(data, ["user", "profile", "name"])).toBe("Raheem");
      expect(getPath(data, ["user", "profile", "tags", 1])).toBe("dev");
    });

    it("returns fallback when key is missing or undefined", () => {
      expect(getPath(data, "user.profile.age", 30)).toBe(30);
      expect(getPath(data, "user.missing.deep", "default")).toBe("default");
      expect(getPath(data, "user.profile.location", "fallback")).toBe(null);
    });

    it("returns fallback if object is null or undefined", () => {
      expect(getPath(null, "a.b", "fallback")).toBe("fallback");
      expect(getPath(undefined, "a.b", "fallback")).toBe("fallback");
    });

    it("returns fallback when traversing non-objects", () => {
      expect(getPath(data, "user.profile.name.first", "fallback")).toBe("fallback");
    });

    it("blocks prototype pollution attacks", () => {
      expect(getPath(data, "__proto__.polluted", "safe")).toBe("safe");
      expect(getPath(data, "user.__proto__", "safe")).toBe("safe");
      expect(getPath(data, ["user", "prototype", "foo"], "safe")).toBe("safe");
    });

    it("returns fallback for empty path", () => {
      expect(getPath(data, "", "fallback")).toBe("fallback");
      expect(getPath(data, [], "fallback")).toBe("fallback");
    });
  });

  describe("deepClone", () => {
    it("clones primitives by value", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("hello")).toBe("hello");
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
      const sym = Symbol("test");
      expect(deepClone(sym)).toBe(sym);
    });

    it("clones nested objects and arrays without sharing references", () => {
      const original = { a: 1, b: [2, 3], c: { d: "nested" } };
      const clone = deepClone(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
      expect(clone.b).not.toBe(original.b);
      expect(clone.c).not.toBe(original.c);

      clone.c.d = "changed";
      expect(original.c.d).toBe("nested");
    });

    it("clones Date instances", () => {
      const date = new Date("2025-01-01T00:00:00Z");
      const clone = deepClone(date);
      expect(clone).toEqual(date);
      expect(clone).not.toBe(date);
      expect(clone instanceof Date).toBe(true);
    });

    it("clones RegExp instances", () => {
      const regex = /test/gi;
      const clone = deepClone(regex);
      expect(clone).toEqual(regex);
      expect(clone).not.toBe(regex);
      expect(clone.source).toBe("test");
      expect(clone.flags).toBe("gi");
    });

    it("clones Map and Set instances", () => {
      const map = new Map([["key", { val: 1 }]]);
      const cloneMap = deepClone(map);
      expect(cloneMap.get("key")).toEqual({ val: 1 });
      expect(cloneMap.get("key")).not.toBe(map.get("key"));

      const set = new Set([{ a: 1 }]);
      const cloneSet = deepClone(set);
      expect(Array.from(cloneSet)[0]).toEqual({ a: 1 });
      expect(Array.from(cloneSet)[0]).not.toBe(Array.from(set)[0]);
    });

    it("clones TypedArrays and ArrayBuffers", () => {
      const buffer = new ArrayBuffer(8);
      const uint8 = new Uint8Array(buffer);
      uint8[0] = 42;
      const cloneUint8 = deepClone(uint8);

      expect(cloneUint8[0]).toBe(42);
      expect(cloneUint8).not.toBe(uint8);
      expect(cloneUint8.buffer).not.toBe(uint8.buffer);
    });

    it("handles circular references gracefully without crashing", () => {
      interface Circular {
        name: string;
        self?: Circular;
      }
      const circular: Circular = { name: "loop" };
      circular.self = circular;

      const clone = deepClone(circular);
      expect(clone.name).toBe("loop");
      expect(clone.self).toBe(clone);
      expect(clone.self).not.toBe(circular);
    });

    it("returns functions and promises by reference", () => {
      const fn = () => "test";
      const promise = Promise.resolve(1);
      const obj = { fn, promise };
      const clone = deepClone(obj);
      expect(clone.fn).toBe(fn);
      expect(clone.promise).toBe(promise);
    });

    it("clones DataView instances", () => {
      const buffer = new ArrayBuffer(16);
      const view = new DataView(buffer, 4, 8);
      view.setInt32(0, 12345);
      const cloneView = deepClone(view);

      expect(cloneView.getInt32(0)).toBe(12345);
      expect(cloneView).not.toBe(view);
      expect(cloneView.buffer).not.toBe(view.buffer);
    });

    it("clones objects with symbol keys and handles Object.create(null)", () => {
      const sym = Symbol("id");
      const nullProto = Object.create(null);
      nullProto[sym] = "symbol-value";
      nullProto.regular = 100;

      const clone = deepClone(nullProto);
      expect(clone[sym]).toBe("symbol-value");
      expect(clone.regular).toBe(100);
      expect(Object.getPrototypeOf(clone)).toBe(null);
    });
  });
});
