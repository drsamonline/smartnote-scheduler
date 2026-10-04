import { getPendingReminders, markReminderAsSent, getNoteById } from "./db";
import { notifyOwner } from "./_core/notification";

/**
 * Process pending reminders and send notifications
 * This should be called periodically (e.g., every minute)
 */
export async function processPendingReminders() {
  try {
    const now = new Date();
    const reminders = await getPendingReminders(now);

    for (const reminder of reminders) {
      const reminderTime = new Date(reminder.reminderTime);

      // Check if it's time to send this reminder
      if (reminderTime <= now) {
        const note = await getNoteById(reminder.noteId);

        if (note) {
          // Send notification
          const delivered = await sendReminder(note);

          // Keep failed reminders pending so a later processor run can retry.
          if (delivered) {
            await markReminderAsSent(reminder.id);
          }
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
async function sendReminder(note: any): Promise<boolean> {
  const title = `Reminder: ${note.title}`;
  const content = `${note.category} due at ${new Date(note.dueDate || note.scheduledDate).toLocaleString()}`;

  try {
    // Send via owner notification system
    await notifyOwner({
      title,
      content,
    });

    console.log(`[Notifications] Sent reminder for note ${note.id}`);
    return true;
  } catch (error) {
    console.error(`[Notifications] Failed to send reminder for note ${note.id}:`, error);
    return false;
  }
}
