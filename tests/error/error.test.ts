import { describe, it, expect } from "vitest";
import { normalizeError, getErrorMessage, isErrorLike } from "../../src/error/index.js";

describe("Error Utilities", () => {
  describe("isErrorLike", () => {
    it("returns true for Error instances", () => {
      expect(isErrorLike(new Error("Boom"))).toBe(true);
      expect(isErrorLike(new TypeError("Bad type"))).toBe(true);
    });

    it("returns true for objects with string name and message", () => {
      expect(isErrorLike({ name: "CustomError", message: "Failed" })).toBe(true);
      expect(isErrorLike({ name: "Error", message: "Boom", stack: "..." })).toBe(true);
    });

    it("returns false for objects missing name or message or with non-string types", () => {
      expect(isErrorLike({ message: "No name" })).toBe(false);
      expect(isErrorLike({ name: "NoMessage" })).toBe(false);
      expect(isErrorLike({ name: 123, message: "msg" })).toBe(false);
      expect(isErrorLike({ name: "err", message: 456 })).toBe(false);
    });

    it("returns false for primitives, null, and undefined", () => {
      expect(isErrorLike(null)).toBe(false);
      expect(isErrorLike(undefined)).toBe(false);
      expect(isErrorLike("Error")).toBe(false);
      expect(isErrorLike(123)).toBe(false);
    });
  });

  describe("getErrorMessage", () => {
    it("extracts message from standard Error", () => {
      expect(getErrorMessage(new Error("Database connection failed"))).toBe(
        "Database connection failed"
      );
    });

    it("returns string errors directly", () => {
      expect(getErrorMessage("Direct string error")).toBe("Direct string error");
    });

    it("extracts message from ErrorLike objects", () => {
      expect(getErrorMessage({ name: "APIError", message: "Unauthorized" })).toBe(
        "Unauthorized"
      );
      expect(getErrorMessage({ message: "Payload missing" })).toBe("Payload missing");
    });

    it("returns default fallback for non-descriptive or null errors", () => {
      expect(getErrorMessage(null)).toBe("An unknown error occurred");
      expect(getErrorMessage(undefined)).toBe("An unknown error occurred");
      expect(getErrorMessage(123)).toBe("An unknown error occurred");
      expect(getErrorMessage("")).toBe("An unknown error occurred");
      expect(getErrorMessage(new Error(""))).toBe("An unknown error occurred");
    });

    it("supports custom fallback parameter", () => {
      expect(getErrorMessage(null, "Custom fallback")).toBe("Custom fallback");
    });
  });

  describe("normalizeError", () => {
    it("returns standard Error instances as-is", () => {
      const err = new Error("Existing error");
      expect(normalizeError(err)).toBe(err);
    });

    it("converts string into Error instance", () => {
      const err = normalizeError("String error message");
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("String error message");
    });

    it("converts ErrorLike object preserving name and cause", () => {
      const errorLike = {
        name: "ValidationError",
        message: "Email is invalid",
        cause: { field: "email" },
        stack: "Custom stack trace",
      };
      const normalized = normalizeError(errorLike);

      expect(normalized).toBeInstanceOf(Error);
      expect(normalized.name).toBe("ValidationError");
      expect(normalized.message).toBe("Email is invalid");
      expect(normalized.cause).toEqual({ field: "email" });
      expect(normalized.stack).toBe("Custom stack trace");
    });

    it("handles primitives, assigning original value to cause", () => {
      const normalized = normalizeError(404);
      expect(normalized).toBeInstanceOf(Error);
      expect(normalized.message).toBe("An unknown error occurred");
      expect(normalized.cause).toBe(404);
    });
  });
});
