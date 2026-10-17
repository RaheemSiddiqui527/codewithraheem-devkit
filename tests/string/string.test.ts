import { describe, it, expect } from "vitest";
import {
  capitalize,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  truncate,
  slugify,
  isBlank,
} from "../../src/string/index.js";

describe("String Utilities", () => {
  describe("capitalize", () => {
    it("capitalizes the first character and lowercases the rest", () => {
      expect(capitalize("hello world")).toBe("Hello world");
      expect(capitalize("HELLO")).toBe("Hello");
      expect(capitalize("fOO BAR")).toBe("Foo bar");
    });

    it("handles empty strings", () => {
      expect(capitalize("")).toBe("");
    });

    it("throws TypeError if argument is not a string", () => {
      // @ts-expect-error testing invalid argument
      expect(() => capitalize(123)).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => capitalize(null)).toThrow(TypeError);
    });
  });

  describe("toCamelCase", () => {
    it("converts delimited strings to camelCase", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld");
      expect(toCamelCase("user_first_name")).toBe("userFirstName");
      expect(toCamelCase("Hello World")).toBe("helloWorld");
    });

    it("handles acronyms and consecutive uppercase", () => {
      expect(toCamelCase("APIResponse")).toBe("apiResponse");
      expect(toCamelCase("getUserID")).toBe("getUserId");
    });

    it("handles strings with numbers", () => {
      expect(toCamelCase("version_2_release")).toBe("version2Release");
    });

    it("handles empty strings and leading/trailing separators", () => {
      expect(toCamelCase("")).toBe("");
      expect(toCamelCase("___")).toBe("");
      expect(toCamelCase("--hello--world--")).toBe("helloWorld");
    });

    it("throws TypeError for non-strings", () => {
      // @ts-expect-error testing invalid argument
      expect(() => toCamelCase(undefined)).toThrow(TypeError);
    });
  });

  describe("toKebabCase", () => {
    it("converts camelCase, PascalCase, snake_case to kebab-case", () => {
      expect(toKebabCase("helloWorld")).toBe("hello-world");
      expect(toKebabCase("HelloWorld")).toBe("hello-world");
      expect(toKebabCase("user_profile_id")).toBe("user-profile-id");
      expect(toKebabCase("User Profile")).toBe("user-profile");
    });

    it("handles consecutive uppercase acronyms", () => {
      expect(toKebabCase("APIResponse")).toBe("api-response");
      expect(toKebabCase("getHTTPSUrl")).toBe("get-https-url");
    });

    it("handles empty strings", () => {
      expect(toKebabCase("")).toBe("");
    });

    it("throws TypeError for non-strings", () => {
      // @ts-expect-error testing invalid argument
      expect(() => toKebabCase(123)).toThrow(TypeError);
    });
  });

  describe("toSnakeCase", () => {
    it("converts camelCase, kebab-case, spaces to snake_case", () => {
      expect(toSnakeCase("helloWorld")).toBe("hello_world");
      expect(toSnakeCase("hello-world")).toBe("hello_world");
      expect(toSnakeCase("Hello World")).toBe("hello_world");
    });

    it("handles acronyms", () => {
      expect(toSnakeCase("APIResponse")).toBe("api_response");
    });

    it("handles empty strings", () => {
      expect(toSnakeCase("")).toBe("");
    });

    it("throws TypeError for non-strings", () => {
      // @ts-expect-error testing invalid argument
      expect(() => toSnakeCase(null)).toThrow(TypeError);
    });
  });

  describe("truncate", () => {
    it("returns original string if within maxLength", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
      expect(truncate("Hello", 5)).toBe("Hello");
    });

    it("truncates longer strings and appends default ellipsis", () => {
      expect(truncate("Hello, World!", 8)).toBe("Hello...");
    });

    it("supports custom suffix", () => {
      expect(truncate("Hello, World!", 8, "…")).toBe("Hello, …");
      expect(truncate("Hello, World!", 10, " [more]")).toBe("Hel [more]");
    });

    it("handles edge cases where maxLength <= suffix length", () => {
      expect(truncate("Hello", 2, "...")).toBe("..");
      expect(truncate("Hello", 0)).toBe("");
      expect(truncate("Hello", -5)).toBe("");
    });

    it("correctly handles Unicode surrogate pairs (emojis)", () => {
      // "🚀🚀🚀🚀🚀" has 5 emoji characters (10 code units)
      expect(truncate("🚀🚀🚀🚀🚀", 4)).toBe("🚀...");
    });

    it("throws TypeError for invalid arguments", () => {
      // @ts-expect-error testing invalid argument
      expect(() => truncate(123, 5)).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => truncate("hello", "5")).toThrow(TypeError);
      // @ts-expect-error testing invalid argument
      expect(() => truncate("hello", 5, 123)).toThrow(TypeError);
    });
  });

  describe("slugify", () => {
    it("converts text to URL slug", () => {
      expect(slugify("Hello, World!")).toBe("hello-world");
      expect(slugify("  Code With Raheem  ")).toBe("code-with-raheem");
    });

    it("normalizes diacritics and accented characters", () => {
      expect(slugify("Café & Crème brûlée")).toBe("cafe-creme-brulee");
      expect(slugify("München Über")).toBe("munchen-uber");
    });

    it("collapses multiple consecutive hyphens and trims edges", () => {
      expect(slugify("---foo---bar---")).toBe("foo-bar");
      expect(slugify("foo & & & bar")).toBe("foo-bar");
    });

    it("handles empty or symbol-only strings", () => {
      expect(slugify("")).toBe("");
      expect(slugify("!@#$%^&*()")).toBe("");
    });

    it("throws TypeError for non-strings", () => {
      // @ts-expect-error testing invalid argument
      expect(() => slugify(null)).toThrow(TypeError);
    });
  });

  describe("isBlank", () => {
    it("returns true for empty strings and whitespace strings", () => {
      expect(isBlank("")).toBe(true);
      expect(isBlank("   ")).toBe(true);
      expect(isBlank("\t\n\r")).toBe(true);
      expect(isBlank("\u00A0")).toBe(true); // non-breaking space
    });

    it("returns true for null and undefined", () => {
      expect(isBlank(null)).toBe(true);
      expect(isBlank(undefined)).toBe(true);
    });

    it("returns false for non-empty non-whitespace strings", () => {
      expect(isBlank("a")).toBe(false);
      expect(isBlank("  hello  ")).toBe(false);
    });

    it("returns false for non-string values", () => {
      expect(isBlank(123)).toBe(false);
      expect(isBlank({})).toBe(false);
      expect(isBlank(false)).toBe(false);
    });
  });
});
