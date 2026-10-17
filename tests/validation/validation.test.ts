import { describe, it, expect } from "vitest";
import {
  safeJsonParse,
  isValidJSON,
  isEmail,
  isURL,
  isUUID,
  isPlainObject,
} from "../../src/validation/index.js";

describe("Validation Utilities", () => {
  describe("safeJsonParse", () => {
    it("returns { success: true, data } for valid JSON", () => {
      const res = safeJsonParse<{ name: string }>('{"name": "Raheem"}');
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data).toEqual({ name: "Raheem" });
      }
    });

    it("parses JSON primitives and arrays", () => {
      expect(safeJsonParse("[1, 2, 3]")).toEqual({ success: true, data: [1, 2, 3] });
      expect(safeJsonParse("42")).toEqual({ success: true, data: 42 });
      expect(safeJsonParse('"string"')).toEqual({ success: true, data: "string" });
      expect(safeJsonParse("true")).toEqual({ success: true, data: true });
      expect(safeJsonParse("null")).toEqual({ success: true, data: null });
    });

    it("supports reviver function", () => {
      const res = safeJsonParse('{"num": 1}', (key, value) => {
        if (key === "num") return (value as number) * 2;
        return value;
      });
      expect(res).toEqual({ success: true, data: { num: 2 } });
    });

    it("returns { success: false, error } for invalid JSON syntax", () => {
      const res = safeJsonParse("not valid json");
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toBeInstanceOf(Error);
      }
    });

    it("returns { success: false, error: TypeError } for non-string input", () => {
      const res = safeJsonParse(123);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toBeInstanceOf(TypeError);
      }
    });
  });

  describe("isValidJSON", () => {
    it("returns true for valid JSON strings", () => {
      expect(isValidJSON('{"a": 1}')).toBe(true);
      expect(isValidJSON("[1, 2]")).toBe(true);
      expect(isValidJSON('"str"')).toBe(true);
      expect(isValidJSON("null")).toBe(true);
      expect(isValidJSON("123")).toBe(true);
    });

    it("returns false for invalid JSON strings", () => {
      expect(isValidJSON("{bad json}")).toBe(false);
      expect(isValidJSON("undefined")).toBe(false);
      expect(isValidJSON("")).toBe(false);
    });

    it("returns false for non-string values", () => {
      expect(isValidJSON(null)).toBe(false);
      expect(isValidJSON(123)).toBe(false);
      expect(isValidJSON({ a: 1 })).toBe(false);
    });
  });

  describe("isEmail", () => {
    it("validates standard email addresses", () => {
      expect(isEmail("raheem@example.com")).toBe(true);
      expect(isEmail("user.name+tag@sub.domain.co")).toBe(true);
      expect(isEmail("dev_123@domain.org")).toBe(true);
    });

    it("rejects invalid email formats", () => {
      expect(isEmail("plainaddress")).toBe(false);
      expect(isEmail("@missing-local.com")).toBe(false);
      expect(isEmail("missing-domain@")).toBe(false);
      expect(isEmail("missing-tld@domain")).toBe(false);
      expect(isEmail("leading.dot.@domain.com")).toBe(false);
      expect(isEmail(".leadingdot@domain.com")).toBe(false);
      expect(isEmail("consecutive..dots@domain.com")).toBe(false);
      expect(isEmail("spaces in@domain.com")).toBe(false);
    });

    it("rejects overly long strings exceeding RFC 5321 limits", () => {
      const longLocal = "a".repeat(65) + "@example.com";
      expect(isEmail(longLocal)).toBe(false);

      const longEmail = "a".repeat(245) + "@example.com";
      expect(isEmail(longEmail)).toBe(false);
    });

    it("returns false for non-string values", () => {
      expect(isEmail(null)).toBe(false);
      expect(isEmail(undefined)).toBe(false);
      expect(isEmail(123)).toBe(false);
    });
  });

  describe("isURL", () => {
    it("validates standard HTTP and HTTPS URLs", () => {
      expect(isURL("https://codewithraheem.dev")).toBe(true);
      expect(isURL("http://localhost:3000/api")).toBe(true);
      expect(isURL("https://example.com/path?q=1#hash")).toBe(true);
    });

    it("supports custom allowed protocols", () => {
      expect(isURL("ftp://files.example.com", { protocols: ["ftp"] })).toBe(true);
      expect(isURL("custom://endpoint", { protocols: ["custom"] })).toBe(true);
    });

    it("rejects disallowed protocols and dangerous schemes", () => {
      expect(isURL("javascript:alert(1)")).toBe(false);
      expect(isURL("data:text/html,<b>hi</b>")).toBe(false);
      expect(isURL("file:///path/to/file")).toBe(false);
    });

    it("rejects invalid URL syntax or missing hostnames", () => {
      expect(isURL("not a url")).toBe(false);
      expect(isURL("https://")).toBe(false);
      expect(isURL("")).toBe(false);
    });

    it("returns false for non-string values", () => {
      expect(isURL(null)).toBe(false);
      expect(isURL(123)).toBe(false);
    });
  });

  describe("isUUID", () => {
    const v1 = "2066c1b4-82ce-11ef-b864-0242ac120002";
    const v4 = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const v5 = "886313e1-3b8a-5372-9b90-0c9aee199e5d";
    const nil = "00000000-0000-0000-0000-000000000000";

    it("validates any RFC 4122 UUID by default", () => {
      expect(isUUID(v1)).toBe(true);
      expect(isUUID(v4)).toBe(true);
      expect(isUUID(v5)).toBe(true);
      expect(isUUID(nil)).toBe(true);
    });

    it("validates specific UUID versions", () => {
      expect(isUUID(v4, 4)).toBe(true);
      expect(isUUID(v1, 4)).toBe(false);
      expect(isUUID(v1, 1)).toBe(true);
      expect(isUUID(v5, 5)).toBe(true);
    });

    it("rejects malformed UUID strings or unknown versions", () => {
      expect(isUUID("not-a-uuid")).toBe(false);
      expect(isUUID("f47ac10b-58cc-4372-a567-0e02b2c3d47")).toBe(false); // too short
      expect(isUUID("f47ac10b-58cc-4372-a567-0e02b2c3d4799")).toBe(false); // too long
      expect(isUUID("g47ac10b-58cc-4372-a567-0e02b2c3d479")).toBe(false); // non-hex
      // @ts-expect-error testing invalid version
      expect(isUUID(v4, 99)).toBe(false);
    });

    it("returns false for non-string values", () => {
      expect(isUUID(null)).toBe(false);
      expect(isUUID(123)).toBe(false);
    });
  });

  describe("isPlainObject", () => {
    it("returns true for object literals and Object.create(null)", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
      expect(isPlainObject(new Object())).toBe(true);
    });

    it("returns false for arrays, functions, and primitives", () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(() => {})).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject("string")).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
    });

    it("returns false for built-in objects and class instances", () => {
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(/regex/)).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(new Set())).toBe(false);
      expect(isPlainObject(new Error("err"))).toBe(false);

      class CustomClass {}
      expect(isPlainObject(new CustomClass())).toBe(false);
    });
  });
});
