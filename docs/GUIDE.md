# SmartNote Scheduler — user guide

**Version 1.0.0 · PolyForm Noncommercial 1.0.0**

Notes that become tasks: you write a sentence, the model assigns a category, a priority and the dates
it finds, and a reminder fires when it is due.

## What it does

| | |
|---|---|
| **Five categories, assigned for you** | Tasks, Deadlines, Schedule, Thoughts and Learning — chosen by the model, not by you |
| **Priority and dates from plain language** | Low / Medium / High, plus the date and time the note contains |
| **Reminders that survive a restart** | due reminders are processed by a heartbeat endpoint, not an in-process timer |
| **Delivery you can audit** | every push and email attempt is logged as `sent`, `failed` or `skipped` — a failure is visible, never silent |
| **Search, filters, stats** | full-text search, category tabs, hide-completed, totals for pending and overdue |
| **Portable notes** | JSON backup and restore, plus CSV and Markdown export |

## Why there is no hosted demo

Because it would misrepresent the software. The client is built with Vite, but every note, reminder
and login lives behind a tRPC server and a MySQL database. **A static page cannot be that app**, so
the project page describes it and you run the real thing locally.

That is the honest choice: a demo that fakes the backend would show you a product you cannot have.

## Running it

You need Node and a MySQL database. Set `DATABASE_URL`, `JWT_SECRET` and the model/webhook keys in
`.env`, then run the client and the server. The migrations in `drizzle/` create the schema.

## The design decision worth knowing

Reminders are **not** an in-process timer. A timer dies with the process, and a reminder that dies
with a restart is a reminder you cannot trust. A heartbeat endpoint picks up what is due, which means
the app can restart, deploy or crash without losing a notification.

## Licence

PolyForm Noncommercial 1.0.0. See [LICENSE](../LICENSE).
