import { describe, it, expect } from "vitest";
import * as DevKit from "../src/index.js";

describe("Root DevKit Re-exports", () => {
  it("exports all array utilities", () => {
    expect(typeof DevKit.chunk).toBe("function");
    expect(typeof DevKit.unique).toBe("function");
    expect(typeof DevKit.groupBy).toBe("function");
    expect(typeof DevKit.partition).toBe("function");
    expect(typeof DevKit.compact).toBe("function");
    expect(typeof DevKit.flatten).toBe("function");
    expect(typeof DevKit.shuffle).toBe("function");
  });

  it("exports all object utilities", () => {
    expect(typeof DevKit.pick).toBe("function");
    expect(typeof DevKit.omit).toBe("function");
    expect(typeof DevKit.isEmpty).toBe("function");
    expect(typeof DevKit.getPath).toBe("function");
    expect(typeof DevKit.deepClone).toBe("function");
  });

  it("exports all string utilities", () => {
    expect(typeof DevKit.capitalize).toBe("function");
    expect(typeof DevKit.toCamelCase).toBe("function");
    expect(typeof DevKit.toKebabCase).toBe("function");
    expect(typeof DevKit.toSnakeCase).toBe("function");
    expect(typeof DevKit.truncate).toBe("function");
    expect(typeof DevKit.slugify).toBe("function");
    expect(typeof DevKit.isBlank).toBe("function");
  });

  it("exports all number utilities", () => {
    expect(typeof DevKit.clamp).toBe("function");
    expect(typeof DevKit.roundTo).toBe("function");
    expect(typeof DevKit.randomInt).toBe("function");
    expect(typeof DevKit.sum).toBe("function");
    expect(typeof DevKit.average).toBe("function");
    expect(typeof DevKit.isFiniteNumber).toBe("function");
  });

  it("exports all async utilities", () => {
    expect(typeof DevKit.sleep).toBe("function");
    expect(typeof DevKit.retry).toBe("function");
    expect(typeof DevKit.withTimeout).toBe("function");
    expect(typeof DevKit.TimeoutError).toBe("function");
    expect(typeof DevKit.debounce).toBe("function");
    expect(typeof DevKit.throttle).toBe("function");
  });

  it("exports all validation utilities", () => {
    expect(typeof DevKit.safeJsonParse).toBe("function");
    expect(typeof DevKit.isValidJSON).toBe("function");
    expect(typeof DevKit.isEmail).toBe("function");
    expect(typeof DevKit.isURL).toBe("function");
    expect(typeof DevKit.isUUID).toBe("function");
    expect(typeof DevKit.isPlainObject).toBe("function");
  });

  it("exports all error utilities", () => {
    expect(typeof DevKit.normalizeError).toBe("function");
    expect(typeof DevKit.getErrorMessage).toBe("function");
    expect(typeof DevKit.isErrorLike).toBe("function");
  });

  it("exports all date utilities", () => {
    expect(typeof DevKit.isValidDate).toBe("function");
    expect(typeof DevKit.startOfDay).toBe("function");
    expect(typeof DevKit.endOfDay).toBe("function");
    expect(typeof DevKit.daysBetween).toBe("function");
  });
});
