/**
 * Converts a string into a URL-friendly slug.
 *
 * Decomposes Unicode diacritics/accents, replaces non-alphanumeric characters
 * with hyphens, collapses consecutive hyphens, and trims leading and trailing hyphens.
 *
 * @param value The string to convert.
 * @returns The slugified string.
 * @throws {TypeError} If `value` is not a string.
 *
 * @example
 * ```ts
 * slugify("Hello, World! 🚀"); // "hello-world"
 * slugify("Café & Crème brûlée"); // "cafe-creme-brulee"
 * slugify("  ---DevKit 101---  "); // "devkit-101"
 * ```
 */
export function slugify(value: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected a string, received ${typeof value}`);
  }

  return (
    value
      // Normalize Unicode characters to decompose diacritical marks
      .normalize("NFD")
      // Remove diacritical marks
      .replace(/[\u0300-\u036f]/g, "")
      // Convert to lowercase
      .toLowerCase()
      // Replace non-alphanumeric characters with hyphens
      .replace(/[^a-z0-9]+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}
