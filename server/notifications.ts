import { getPendingReminders, markReminderAsSent, getNoteById } from "./db";
import { notifyOwner } from "./_core/notification";

/**
 * Process pending reminders and send notifications
 * This should be called periodically (e.g., every minute)
 */
export async function processPendingReminders() {
  try {
    const reminders = await getPendingReminders();
    const now = new Date();

    for (const reminder of reminders) {
      const reminderTime = new Date(reminder.reminderTime);

      // Check if it's time to send this reminder
      if (reminderTime <= now) {
        const note = await getNoteById(reminder.noteId);

        if (note) {
          // Send notification
          await sendReminder(note, reminder);

          // Mark as sent
          await markReminderAsSent(reminder.id);
        }
      }
    }
  } catch (error) {
    console.error("[Notifications] Error processing reminders:", error);
  }
}

/**
 * Send a reminder notification
 */
async function sendReminder(note: any, reminder: any) {
  const title = `Reminder: ${note.title}`;
  const content = `${note.category} due at ${new Date(note.dueDate || note.scheduledDate).toLocaleString()}`;

  try {
    // Send via owner notification system
    await notifyOwner({
      title,
      content,
    });

    console.log(`[Notifications] Sent reminder for note ${note.id}`);
  } catch (error) {
    console.error(`[Notifications] Failed to send reminder for note ${note.id}:`, error);
  }
}

/**
 * Start reminder processing interval
 */
export function startReminderProcessor() {
  // Process reminders every minute
  const intervalId = setInterval(() => {
    processPendingReminders();
  }, 60 * 1000);

  // Also run immediately on startup
  processPendingReminders();

  return intervalId;
}
