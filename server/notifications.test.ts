import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getPendingReminders: vi.fn(),
  markReminderAsSent: vi.fn(),
  getNoteById: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("./db", () => ({
  getPendingReminders: mocks.getPendingReminders,
  markReminderAsSent: mocks.markReminderAsSent,
  getNoteById: mocks.getNoteById,
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: mocks.notifyOwner,
}));

import { processPendingReminders } from "./notifications";

const reminder = {
  id: 7,
  noteId: 12,
  reminderTime: new Date("2020-01-01T10:00:00.000Z"),
  notificationType: "both" as const,
  isSent: 0,
  createdAt: new Date("2020-01-01T09:00:00.000Z"),
};

const note = {
  id: 12,
  title: "Submit report",
  category: "Deadlines" as const,
  dueDate: new Date("2020-01-01T11:00:00.000Z"),
  scheduledDate: null,
};

describe("processPendingReminders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPendingReminders.mockResolvedValue([reminder]);
    mocks.getNoteById.mockResolvedValue(note);
    mocks.notifyOwner.mockResolvedValue(true);
    mocks.markReminderAsSent.mockResolvedValue(undefined);
  });

  it("sends due reminders and marks them sent after delivery succeeds", async () => {
    await processPendingReminders();

    expect(mocks.getPendingReminders).toHaveBeenCalledWith(expect.any(Date));
    expect(mocks.notifyOwner).toHaveBeenCalledWith({
      title: "Reminder: Submit report",
      content: expect.stringContaining("Deadlines due at"),
    });
    expect(mocks.markReminderAsSent).toHaveBeenCalledWith(reminder.id);
  });

  it("leaves a reminder pending when notification delivery fails", async () => {
    mocks.notifyOwner.mockRejectedValueOnce(new Error("temporary outage"));

    await processPendingReminders();

    expect(mocks.markReminderAsSent).not.toHaveBeenCalled();
  });
});
