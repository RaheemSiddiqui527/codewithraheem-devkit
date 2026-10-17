import { describe, it, expect } from "vitest";
import {
  chunk,
  unique,
  groupBy,
  partition,
  compact,
  flatten,
  shuffle,
} from "../../src/array/index.js";

describe("Array Utilities", () => {
  describe("chunk", () => {
    it("splits an array into chunks of specified size", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk(["a", "b", "c", "d"], 2)).toEqual([
        ["a", "b"],
        ["c", "d"],
      ]);
    });

    it("returns the entire array as a single chunk if size >= length", () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it("returns an empty array when given an empty array", () => {
      expect(chunk([], 3)).toEqual([]);
    });

    it("does not mutate the source array", () => {
      const original = [1, 2, 3, 4];
      chunk(original, 2);
      expect(original).toEqual([1, 2, 3, 4]);
    });

    it("throws TypeError if first argument is not an array", () => {
      // @ts-expect-error testing invalid argument
      expect(() => chunk("not-array", 2)).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => chunk(null, 2)).toThrow(TypeError);
    });

    it("throws RangeError if size is <= 0 or not an integer", () => {
      expect(() => chunk([1, 2], 0)).toThrow(RangeError);
      expect(() => chunk([1, 2], -1)).toThrow(RangeError);
      expect(() => chunk([1, 2], 1.5)).toThrow(RangeError);
      // @ts-expect-error testing invalid argument
      expect(() => chunk([1, 2], "2")).toThrow(RangeError);
    });
  });

  describe("unique", () => {
    it("deduplicates array elements while preserving first-seen order", () => {
      expect(unique([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
    });

    it("handles NaN correctly (Set deduplication)", () => {
      expect(unique([NaN, 1, NaN, 2])).toEqual([NaN, 1, 2]);
    });

    it("handles empty arrays", () => {
      expect(unique([])).toEqual([]);
    });

    it("does not mutate the input array", () => {
      const input = [1, 2, 1];
      unique(input);
      expect(input).toEqual([1, 2, 1]);
    });

    it("throws TypeError if input is not an array", () => {
      // @ts-expect-error testing invalid argument
      expect(() => unique(null)).toThrow(TypeError);
    });
  });

  describe("groupBy", () => {
    it("groups array elements using a key function", () => {
      const words = ["one", "two", "three", "four"];
      const grouped = groupBy(words, (w) => w.length);
      expect(grouped).toEqual({
        3: ["one", "two"],
        4: ["four"],
        5: ["three"],
      });
    });

    it("passes index to key function", () => {
      const items = ["a", "b", "c"];
      const grouped = groupBy(items, (_, index) => (index % 2 === 0 ? "even" : "odd"));
      expect(grouped).toEqual({
        even: ["a", "c"],
        odd: ["b"],
      });
    });

    it("returns empty object for empty array", () => {
      expect(groupBy([], () => "key")).toEqual({});
    });

    it("throws TypeError if arguments are invalid", () => {
      // @ts-expect-error testing invalid argument
      expect(() => groupBy(null, () => "a")).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => groupBy([1, 2], "not-fn")).toThrow(TypeError);
    });
  });

  describe("partition", () => {
    it("splits array into truthy and falsy parts", () => {
      const [evens, odds] = partition([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0);
      expect(evens).toEqual([2, 4, 6]);
      expect(odds).toEqual([1, 3, 5]);
    });

    it("supports TypeScript type guard predicate", () => {
      const mixed: (string | number)[] = ["a", 1, "b", 2];
      const [strings, numbers] = partition(
        mixed,
        (x): x is string => typeof x === "string"
      );
      expect(strings).toEqual(["a", "b"]);
      expect(numbers).toEqual([1, 2]);
    });

    it("handles empty arrays", () => {
      expect(partition([], () => true)).toEqual([[], []]);
    });

    it("does not mutate the source array", () => {
      const arr = [1, 2, 3];
      partition(arr, (n) => n > 1);
      expect(arr).toEqual([1, 2, 3]);
    });

    it("throws TypeError for invalid arguments", () => {
      // @ts-expect-error testing invalid argument
      expect(() => partition("bad", () => true)).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => partition([1], null)).toThrow(TypeError);
    });
  });

  describe("compact", () => {
    it("removes all falsy values", () => {
      const mixed = [0, 1, false, 2, "", 3, null, undefined, NaN, "hello"];
      expect(compact(mixed)).toEqual([1, 2, 3, "hello"]);
    });

    it("keeps truthy values like empty objects and arrays", () => {
      const arr = [{}, [], true, "0"];
      expect(compact(arr)).toEqual([{}, [], true, "0"]);
    });

    it("returns empty array when given an empty array", () => {
      expect(compact([])).toEqual([]);
    });

    it("throws TypeError if input is not an array", () => {
      // @ts-expect-error testing invalid argument
      expect(() => compact(undefined)).toThrow(TypeError);
    });
  });

  describe("flatten", () => {
    it("flattens an array 1 level deep by default", () => {
      expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5]);
    });

    it("flattens to a custom depth", () => {
      expect(flatten([1, [2, [3, [4]], 5]], 2)).toEqual([1, 2, 3, [4], 5]);
      expect(flatten([1, [2, [3, [4]], 5]], Infinity)).toEqual([1, 2, 3, 4, 5]);
    });

    it("returns shallow copy if depth is 0", () => {
      const nested = [1, [2]];
      const res = flatten(nested, 0);
      expect(res).toEqual([1, [2]]);
      expect(res).not.toBe(nested);
    });

    it("handles empty arrays", () => {
      expect(flatten([])).toEqual([]);
    });

    it("throws TypeError if not an array", () => {
      // @ts-expect-error testing invalid argument
      expect(() => flatten("foo")).toThrow(TypeError);
    });

    it("throws RangeError if depth is invalid", () => {
      expect(() => flatten([1, 2], -1)).toThrow(RangeError);
      expect(() => flatten([1, 2], NaN)).toThrow(RangeError);
    });
  });

  describe("shuffle", () => {
    it("does not mutate original array and preserves elements", () => {
      const original = [1, 2, 3, 4, 5];
      const result = shuffle(original);
      expect(result).toHaveLength(original.length);
      expect(result.sort()).toEqual(original.slice().sort());
      expect(original).toEqual([1, 2, 3, 4, 5]);
    });

    it("uses injected random function for deterministic testing", () => {
      // An injected generator that returns fixed values
      const deterministicRandom = () => 0.5;
      const arr = [10, 20, 30, 40];
      const result1 = shuffle(arr, deterministicRandom);
      const result2 = shuffle(arr, deterministicRandom);
      expect(result1).toEqual(result2);
    });

    it("handles empty and single-element arrays", () => {
      expect(shuffle([])).toEqual([]);
      expect(shuffle([42])).toEqual([42]);
    });

    it("throws TypeError for invalid arguments", () => {
      // @ts-expect-error testing invalid argument
      expect(() => shuffle(123)).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => shuffle([1, 2], "not-fn")).toThrow(TypeError);
    });
  });
});
