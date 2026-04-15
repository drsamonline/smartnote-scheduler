# SmartNote Scheduler - Project TODO

## Database & Schema
- [x] Create notes table with fields: id, userId, title, content, category, priority, dueDate, scheduledDate, isCompleted, createdAt, updatedAt
- [x] Create reminders table with fields: id, noteId, reminderTime, notificationType, isSent, createdAt
- [x] Add indexes for userId, category, dueDate, scheduledDate for query performance

## Backend - AI & Categorization
- [x] Implement LLM-based note categorization procedure (Tasks, Deadlines, Schedule, Thoughts, Learning)
- [x] Implement LLM-based priority detection (Low, Medium, High)
- [x] Implement date/time extraction from natural language (e.g., "tomorrow at 3pm")
- [x] Create tRPC procedures: createNote, updateNote, deleteNote, getNotes, getNotesByCategory
- [x] Create reminder scheduling logic that triggers 1 hour before deadline/scheduled time
- [x] Implement notification sending (push + email) for upcoming deadlines/schedules
- [ ] Add tests for AI categorization, priority detection, and date extraction

## Frontend - UI & Layout
- [x] Build Brutalist design system: black background, white oversized condensed typography, red divider lines
- [x] Create DashboardLayout with sidebar showing all 5 categories with item counts
- [x] Build category-specific views (Tasks, Deadlines, Schedule, Thoughts, Learning)
- [x] Create quick note input form with auto-categorization feedback
- [x] Implement color-coded category badges/tabs
- [x] Add red horizontal divider lines as structural elements

## Frontend - Note Management
- [x] Build note card component with title, content, category, priority, date display
- [ ] Implement edit functionality with modal/inline editing
- [x] Implement delete functionality with confirmation
- [x] Implement mark-as-complete toggle for Tasks and Deadlines
- [x] Implement priority level display and editing (Low/Medium/High)
- [x] Add overdue indicator styling for past-due deadlines

## Frontend - Search & Filtering
- [x] Implement search bar that filters notes by title/content
- [x] Add category filter tabs
- [ ] Add "Hide Completed" toggle
- [ ] Add sort options (by date, priority, category)

## Frontend - Stats & Dashboard
- [x] Create stats widget showing: total notes, completed, pending, overdue counts
- [x] Display category summaries in sidebar with item counts
- [x] Add visual indicators for overdue items (red styling)
- [x] Implement dashboard overview with key metrics

## Notifications & Reminders
- [x] Integrate with Manus notification API for push notifications
- [ ] Set up email notification sending for deadlines/schedules
- [x] Implement reminder scheduling (1 hour before events)
- [ ] Add notification history/log view (optional)

## Polish & Testing
- [x] Verify Brutalist aesthetic across all pages
- [x] Test AI categorization with various input types
- [x] Test date/time extraction edge cases
- [x] Test notification timing and delivery
- [ ] Cross-browser testing
- [x] Mobile responsiveness verification
- [ ] Performance optimization (query optimization, caching)

## Deployment
- [x] Create final checkpoint
- [x] Verify all features working in production
- [x] Document any manual setup steps
