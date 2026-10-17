import { describe, it, expect } from "vitest";
import { isValidDate, startOfDay, endOfDay, daysBetween } from "../../src/date/index.js";

describe("Date Utilities", () => {
  describe("isValidDate", () => {
    it("returns true for valid Date instances", () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date("2025-01-01"))).toBe(true);
      expect(isValidDate(new Date(1700000000000))).toBe(true);
    });

    it("returns false for invalid Date instances (NaN time)", () => {
      expect(isValidDate(new Date("not-a-date"))).toBe(false);
    });

    it("returns false for non-Date types", () => {
      expect(isValidDate("2025-01-01")).toBe(false);
      expect(isValidDate(1700000000000)).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate({})).toBe(false);
    });
  });

  describe("startOfDay", () => {
    it("returns a new Date at midnight 00:00:00.000 local time", () => {
      const original = new Date(2025, 5, 15, 14, 30, 45, 123);
      const start = startOfDay(original);

      expect(start.getFullYear()).toBe(2025);
      expect(start.getMonth()).toBe(5);
      expect(start.getDate()).toBe(15);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
    });

    it("does not mutate the original Date object", () => {
      const original = new Date(2025, 5, 15, 14, 30, 45, 123);
      const originalTime = original.getTime();
      const start = startOfDay(original);

      expect(start).not.toBe(original);
      expect(original.getTime()).toBe(originalTime);
    });

    it("throws TypeError if input is not a valid Date", () => {
      // @ts-expect-error testing invalid argument
      expect(() => startOfDay("2025-01-01")).toThrow(TypeError);
      expect(() => startOfDay(new Date("invalid"))).toThrow(TypeError);
    });
  });

  describe("endOfDay", () => {
    it("returns a new Date at 23:59:59.999 local time", () => {
      const original = new Date(2025, 5, 15, 10, 0, 0, 0);
      const end = endOfDay(original);

      expect(end.getFullYear()).toBe(2025);
      expect(end.getMonth()).toBe(5);
      expect(end.getDate()).toBe(15);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
    });

    it("does not mutate the original Date object", () => {
      const original = new Date(2025, 5, 15, 10, 0, 0, 0);
      const originalTime = original.getTime();
      const end = endOfDay(original);

      expect(end).not.toBe(original);
      expect(original.getTime()).toBe(originalTime);
    });

    it("throws TypeError if input is not a valid Date", () => {
      // @ts-expect-error testing invalid argument
      expect(() => endOfDay(null)).toThrow(TypeError);
      expect(() => endOfDay(new Date("invalid"))).toThrow(TypeError);
    });
  });

  describe("daysBetween", () => {
    it("returns 0 when dates fall on the same calendar day", () => {
      const d1 = new Date(2025, 2, 10, 8, 0, 0);
      const d2 = new Date(2025, 2, 10, 22, 0, 0);
      expect(daysBetween(d1, d2)).toBe(0);
      expect(daysBetween(d1, d1)).toBe(0);
    });

    it("calculates positive days when end is after start", () => {
      const start = new Date(2025, 2, 10);
      const end = new Date(2025, 2, 15);
      expect(daysBetween(start, end)).toBe(5);
    });

    it("calculates negative days when end is before start", () => {
      const start = new Date(2025, 2, 15);
      const end = new Date(2025, 2, 10);
      expect(daysBetween(start, end)).toBe(-5);
    });

    it("handles month and year boundaries correctly", () => {
      const dec31 = new Date(2024, 11, 31);
      const jan2 = new Date(2025, 0, 2);
      expect(daysBetween(dec31, jan2)).toBe(2);
    });

    it("accurately handles leap years", () => {
      const feb28 = new Date(2024, 1, 28);
      const mar1 = new Date(2024, 2, 1);
      // 2024 is a leap year, so Feb 29 exists between Feb 28 and Mar 1
      expect(daysBetween(feb28, mar1)).toBe(2);
    });

    it("does not mutate either input Date", () => {
      const d1 = new Date(2025, 0, 1);
      const d2 = new Date(2025, 0, 10);
      const t1 = d1.getTime();
      const t2 = d2.getTime();

      daysBetween(d1, d2);
      expect(d1.getTime()).toBe(t1);
      expect(d2.getTime()).toBe(t2);
    });

    it("throws TypeError if either date is invalid", () => {
      const valid = new Date(2025, 0, 1);
      const invalid = new Date("invalid");

      expect(() => daysBetween(invalid, valid)).toThrow(TypeError);
      expect(() => daysBetween(valid, invalid)).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => daysBetween("2025-01-01", valid)).toThrow(TypeError);
    });
  });
});
