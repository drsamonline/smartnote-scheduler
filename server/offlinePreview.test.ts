import { describe, expect, it } from "vitest";
import { analyzeOfflinePreview } from "../client/src/lib/offlinePreview";

describe("offline note review preview", () => {
  it("shows matched keywords, inferred category, priority, and time", () => {
    const preview = analyzeOfflinePreview("Submit the urgent report tomorrow at 5pm");
    expect(preview.category).toBe("Deadlines");
    expect(preview.priority).toBe("High");
    expect(preview.matchedKeywords).toEqual(expect.arrayContaining(["submit", "urgent"]));
    expect(preview.extractedTime).toBe("17:00");
    expect(preview.extractedDate).toBeDefined();
  });

  it("defaults unclassified text to Thoughts without hiding the review", () => {
    const preview = analyzeOfflinePreview("A quiet thought about the week");
    expect(preview.category).toBe("Thoughts");
    expect(preview.priority).toBe("Medium");
    expect(preview.matchedKeywords).toContain("thought");
  });

  it("extracts schedule reminder details for the review panel", () => {
    const preview = analyzeOfflinePreview("Team meeting Friday at 10am");
    expect(preview.category).toBe("Schedule");
    expect(preview.extractedDate).toBeDefined();
    expect(preview.extractedTime).toBe("10:00");
  });
});
