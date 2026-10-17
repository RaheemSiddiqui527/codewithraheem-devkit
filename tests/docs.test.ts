import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as DevKit from "../src/index.js";

describe("Documentation Integrity & Verification", () => {
  const docsDir = path.resolve(process.cwd(), "docs");
  const readmePath = path.resolve(process.cwd(), "README.md");

  const requiredDocFiles = [
    "getting-started.md",
    "array.md",
    "object.md",
    "string.md",
    "number.md",
    "async.md",
    "validation.md",
    "errors.md",
    "date.md",
    "typescript.md",
    "browser-and-node.md",
    "api-reference.md",
    "contributing.md",
    "faq.md",
  ];

  it("ensures all 14 required documentation files exist", () => {
    for (const filename of requiredDocFiles) {
      const filePath = path.join(docsDir, filename);
      expect(fs.existsSync(filePath), `Expected docs/${filename} to exist`).toBe(true);
    }
  });

  it("verifies every public export is indexed in docs/api-reference.md", () => {
    const apiRefContent = fs.readFileSync(
      path.join(docsDir, "api-reference.md"),
      "utf-8"
    );

    const exportedKeys = Object.keys(DevKit) as (keyof typeof DevKit)[];

    for (const key of exportedKeys) {
      expect(
        apiRefContent.includes(`\`${key}\``),
        `Public export "${key}" must be indexed in docs/api-reference.md`
      ).toBe(true);
    }
  });

  it("verifies README.md documentation index links resolve to real files", () => {
    const readmeContent = fs.readFileSync(readmePath, "utf-8");
    const linkRegex = /\[[^\]]+\]\((docs\/[^)]+\.md)\)/g;
    let match: RegExpExecArray | null;

    let linkCount = 0;
    while ((match = linkRegex.exec(readmeContent)) !== null) {
      linkCount++;
      const relativeLink = match[1]!;
      const targetPath = path.resolve(process.cwd(), relativeLink);
      expect(
        fs.existsSync(targetPath),
        `README link "${relativeLink}" must resolve to an existing file`
      ).toBe(true);
    }

    expect(linkCount).toBeGreaterThanOrEqual(14);
  });

  it("verifies api-reference.md links and anchor targets exist", () => {
    const apiRefContent = fs.readFileSync(
      path.join(docsDir, "api-reference.md"),
      "utf-8"
    );
    const linkRegex = /\[Docs\]\(([^)#]+)(?:#([^)]+))?\)/g;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(apiRefContent)) !== null) {
      const targetFile = match[1]!;
      const anchor = match[2];

      const targetPath = path.join(docsDir, targetFile);
      expect(
        fs.existsSync(targetPath),
        `Link in api-reference.md to "${targetFile}" must exist`
      ).toBe(true);

      if (anchor) {
        const fileContent = fs.readFileSync(targetPath, "utf-8").toLowerCase();
        // GitHub heading anchors strip punctuation and lowercase
        const cleanAnchor = anchor.toLowerCase().replace(/[^a-z0-9-]/g, "");
        const headingExists =
          fileContent.includes(`# \`${cleanAnchor}\``) ||
          fileContent.includes(`## \`${cleanAnchor}\``) ||
          fileContent.includes(`### \`${cleanAnchor}\``) ||
          fileContent.includes(cleanAnchor);

        expect(
          headingExists,
          `Anchor "#${anchor}" in docs/${targetFile} must correspond to a section`
        ).toBe(true);
      }
    }
  });

  it("verifies all module documentation files have valid non-empty content", () => {
    for (const filename of requiredDocFiles) {
      const content = fs.readFileSync(path.join(docsDir, filename), "utf-8");
      expect(content.length).toBeGreaterThan(200);
      expect(content.startsWith("# ")).toBe(true);
    }
  });
});
