import { describe, expect, it } from "vitest";
import { notesToCsv, notesToMarkdown } from "../client/src/lib/noteExports";

const notes = [{
  title: "Project, launch",
  content: "Ship it\nwith a checklist",
  category: "Tasks",
  priority: "High",
  isCompleted: 0,
  dueDate: "2026-10-10T10:00:00.000Z",
  scheduledDate: null,
  createdAt: "2026-10-01T10:00:00.000Z",
}];

describe("note exports", () => {
  it("quotes CSV values and emits a stable header", () => {
    const csv = notesToCsv(notes);
    expect(csv.split("\n")[0]).toContain("\"Title\",\"Content\",\"Category\"");
    expect(csv).toContain('"Project, launch"');
    expect(csv).toContain('"Ship it with a checklist"');
  });

  it("creates readable Markdown note sections", () => {
    const markdown = notesToMarkdown(notes, new Date("2026-10-05T00:00:00.000Z"));
    expect(markdown).toContain("# SmartNote Scheduler Export");
    expect(markdown).toContain("## 1. Project, launch");
    expect(markdown).toContain("- **Category:** Tasks");
    expect(markdown).toContain("Ship it\nwith a checklist");
  });
});
