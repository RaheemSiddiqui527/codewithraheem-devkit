import { describe, it, expect } from "vitest";
import {
  clamp,
  roundTo,
  randomInt,
  sum,
  average,
  isFiniteNumber,
} from "../../src/number/index.js";

describe("Number Utilities", () => {
  describe("clamp", () => {
    it("clamps value within min and max", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(3, 3, 3)).toBe(3);
    });

    it("works with negative ranges", () => {
      expect(clamp(-10, -20, -5)).toBe(-10);
      expect(clamp(-30, -20, -5)).toBe(-20);
      expect(clamp(0, -20, -5)).toBe(-5);
    });

    it("throws RangeError if min > max", () => {
      expect(() => clamp(5, 10, 0)).toThrow(RangeError);
    });

    it("throws TypeError if any argument is NaN or not a number", () => {
      expect(() => clamp(NaN, 0, 10)).toThrow(TypeError);
      expect(() => clamp(5, NaN, 10)).toThrow(TypeError);
      // @ts-expect-error testing invalid arguments
      expect(() => clamp(5, 0, "10")).toThrow(TypeError);
    });
  });

  describe("roundTo", () => {
    it("rounds to specified decimal places accurately", () => {
      expect(roundTo(1.234, 2)).toBe(1.23);
      expect(roundTo(1.236, 2)).toBe(1.24);
      expect(roundTo(123.456, 0)).toBe(123);
    });

    it("avoids floating-point rounding errors (e.g. 1.005)", () => {
      // In native JS: 1.005 * 100 = 100.49999999999999 -> Math.round gives 100 (1.00)
      // roundTo gives the mathematically expected 1.01
      expect(roundTo(1.005, 2)).toBe(1.01);
    });

    it("handles negative numbers correctly", () => {
      expect(roundTo(-1.005, 2)).toBe(-1.01);
      expect(roundTo(-2.345, 1)).toBe(-2.3);
    });

    it("preserves Infinity", () => {
      expect(roundTo(Infinity, 2)).toBe(Infinity);
      expect(roundTo(-Infinity, 2)).toBe(-Infinity);
    });

    it("throws RangeError for negative or non-integer decimals", () => {
      expect(() => roundTo(1.23, -1)).toThrow(RangeError);
      expect(() => roundTo(1.23, 1.5)).toThrow(RangeError);
    });

    it("throws TypeError for NaN or invalid number inputs", () => {
      expect(() => roundTo(NaN, 2)).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => roundTo("1.23", 2)).toThrow(TypeError);
      // @ts-expect-error testing invalid decimals
      expect(() => roundTo(1.23, "2")).toThrow(TypeError);
      expect(() => roundTo(1.23, NaN)).toThrow(TypeError);
    });
  });

  describe("randomInt", () => {
    it("generates an integer within the inclusive range", () => {
      for (let i = 0; i < 20; i++) {
        const val = randomInt(5, 15);
        expect(Number.isInteger(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThanOrEqual(15);
      }
    });

    it("returns min when min === max", () => {
      expect(randomInt(7, 7)).toBe(7);
    });

    it("uses injected random generator for deterministic testing", () => {
      expect(randomInt(1, 10, () => 0)).toBe(1);
      expect(randomInt(1, 10, () => 0.5)).toBe(6);
      expect(randomInt(1, 10, () => 0.9999999)).toBe(10);
    });

    it("throws RangeError if min > max", () => {
      expect(() => randomInt(10, 5)).toThrow(RangeError);
    });

    it("throws TypeError if arguments are not safe integers or random is not a function", () => {
      expect(() => randomInt(1.5, 5)).toThrow(TypeError);
      expect(() => randomInt(1, 5.5)).toThrow(TypeError);
      // @ts-expect-error testing invalid arguments
      expect(() => randomInt(1, 5, "not-a-func")).toThrow(TypeError);
    });
  });

  describe("sum", () => {
    it("sums an array of numbers", () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
      expect(sum([-5, 5, -10, 10])).toBe(0);
      expect(sum([0.1, 0.2])).toBeCloseTo(0.3);
    });

    it("returns 0 for an empty array", () => {
      expect(sum([])).toBe(0);
    });

    it("throws TypeError if input is not an array or contains invalid numbers", () => {
      // @ts-expect-error testing invalid argument
      expect(() => sum("not-array")).toThrow(TypeError);
      // @ts-expect-error testing invalid element
      expect(() => sum([1, 2, "3"])).toThrow(TypeError);
      expect(() => sum([1, NaN, 3])).toThrow(TypeError);
    });
  });

  describe("average", () => {
    it("calculates the arithmetic mean of numbers", () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([10, 20])).toBe(15);
    });

    it("returns 0 for an empty array", () => {
      expect(average([])).toBe(0);
    });

    it("throws TypeError if argument is invalid or contains NaN", () => {
      // @ts-expect-error testing invalid argument
      expect(() => average(null)).toThrow(TypeError);
      expect(() => average([1, NaN])).toThrow(TypeError);
    });
  });

  describe("isFiniteNumber", () => {
    it("returns true for finite numbers", () => {
      expect(isFiniteNumber(0)).toBe(true);
      expect(isFiniteNumber(-42)).toBe(true);
      expect(isFiniteNumber(3.14159)).toBe(true);
      expect(isFiniteNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it("returns false for non-finite numbers", () => {
      expect(isFiniteNumber(Infinity)).toBe(false);
      expect(isFiniteNumber(-Infinity)).toBe(false);
      expect(isFiniteNumber(NaN)).toBe(false);
    });

    it("returns false for non-numeric types (unlike global isFinite)", () => {
      expect(isFiniteNumber("42")).toBe(false);
      expect(isFiniteNumber("")).toBe(false);
      expect(isFiniteNumber(null)).toBe(false);
      expect(isFiniteNumber(true)).toBe(false);
      expect(isFiniteNumber({})).toBe(false);
    });
  });
});
