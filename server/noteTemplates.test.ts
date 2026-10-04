import { describe, expect, it } from "vitest";
import { noteTemplates } from "../client/src/data/noteTemplates";

describe("noteTemplates", () => {
  it("contains 25 unique templates across the five note categories", () => {
    expect(noteTemplates).toHaveLength(25);
    expect(new Set(noteTemplates.map((template) => template.id)).size).toBe(25);
    expect(new Set(noteTemplates.map((template) => template.category))).toEqual(
      new Set(["Tasks", "Deadlines", "Schedule", "Thoughts", "Learning"]),
    );
  });

  it("provides usable starter content for every template", () => {
    for (const template of noteTemplates) {
      expect(template.title.length).toBeGreaterThan(0);
      expect(template.description.length).toBeGreaterThan(0);
      expect(template.content.length).toBeGreaterThan(10);
    }
  });
});
