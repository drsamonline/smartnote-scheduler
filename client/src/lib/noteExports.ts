export type ExportableNote = {
  title: string;
  content: string;
  category: string;
  priority: string;
  isCompleted: number;
  dueDate?: Date | string | null;
  scheduledDate?: Date | string | null;
  createdAt?: Date | string | null;
};

function formatDate(value?: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""').replaceAll("\r", " ").replaceAll("\n", " ")}"`;
}

export function notesToCsv(notes: ExportableNote[]) {
  const headers = ["Title", "Content", "Category", "Priority", "Completed", "Due Date", "Scheduled Date", "Created At"];
  const rows = notes.map((note) => [
    note.title,
    note.content,
    note.category,
    note.priority,
    note.isCompleted ? "Yes" : "No",
    formatDate(note.dueDate),
    formatDate(note.scheduledDate),
    formatDate(note.createdAt),
  ]);
  return [headers, ...rows].map((row) => row.map((value) => escapeCsv(String(value))).join(",")).join("\n");
}

export function notesToMarkdown(notes: ExportableNote[], exportedAt = new Date()) {
  const lines = ["# SmartNote Scheduler Export", "", `Exported: ${exportedAt.toISOString()}`, "", `Total notes: ${notes.length}`, ""];
  for (let index = 0; index < notes.length; index += 1) {
    const note = notes[index];
    lines.push(`## ${index + 1}. ${note.title}`, "", `- **Category:** ${note.category}`, `- **Priority:** ${note.priority}`, `- **Status:** ${note.isCompleted ? "Completed" : "Pending"}`);
    if (note.dueDate) lines.push(`- **Due:** ${formatDate(note.dueDate)}`);
    if (note.scheduledDate) lines.push(`- **Scheduled:** ${formatDate(note.scheduledDate)}`);
    lines.push("", note.content.trim(), "");
  }
  return lines.join("\n");
}
