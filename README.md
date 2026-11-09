# SmartNote Scheduler — notes that schedule themselves

An AI note app: write a note in plain English and it is classified, prioritised,
dated and reminded. No folders, no date pickers, no category dropdowns.

**Status: in development.** The repository is public so the work is visible while it
is still being built — there is no release yet, and no hosted instance, because the
app is a React client plus a Node/tRPC server on a MySQL-compatible database.

Project page: **https://drsamonline.github.io/smartnote-scheduler/**

## What it does

- **Five categories, assigned for you** — Tasks, Deadlines, Schedule, Thoughts, Learning.
- **Priority and dates from plain language** — Low/Medium/High, plus the date and time
  the note contains.
- **Reminders that survive a restart** — due reminders are processed by a heartbeat
  endpoint, not an in-process timer.
- **Delivery you can audit** — every push and email attempt is logged as sent, failed
  or skipped.
- **Search, filters, stats** — full-text search, category tabs, hide-completed, and
  pending/overdue totals.
- **Your notes stay portable** — JSON backup and restore, plus CSV and Markdown export.

## Stack

React + Vite · tRPC · Drizzle ORM (SQL migrations in `drizzle/`) · MySQL-compatible
database · TypeScript on both sides · vitest.

## Run it locally

Node 20+, `pnpm`, and a MySQL-compatible database.

```bash
pnpm install
# .env: DATABASE_URL, JWT_SECRET, and the model/webhook keys you use
pnpm db:push                  # generate + apply the migrations
pnpm dev                      # server + Vite HMR
pnpm test                     # vitest
pnpm check                    # tsc --noEmit
pnpm build && pnpm start      # production
```

Configuration is read from environment variables at start-up (`server/_core/env.ts`);
no key is stored in the repository, and `.env` is ignored.

## Layout

```
client/     React app (Vite). client/index.html is the dev entry, not a published page.
server/     tRPC routers, reminder processing, storage, tests.
drizzle/    schema and SQL migrations.
docs/       the project page published at the URL above.
shared/     types shared by both sides.
```

## Licence

MIT — see [LICENSE](LICENSE).

Author: Dr Sohil Momin.
