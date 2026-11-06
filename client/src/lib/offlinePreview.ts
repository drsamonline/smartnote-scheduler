export type PreviewCategory = "Tasks" | "Deadlines" | "Schedule" | "Thoughts" | "Learning";
export type PreviewPriority = "Low" | "Medium" | "High";

const categoryKeywords: Array<{ category: PreviewCategory; keywords: string[] }> = [
  { category: "Deadlines", keywords: ["deadline", "due", "submit", "submission", "deliver", "by", "before", "expires"] },
  { category: "Schedule", keywords: ["meeting", "appointment", "calendar", "event", "schedule", "conference", "call with", "see you"] },
  { category: "Learning", keywords: ["learn", "study", "understand", "research", "read", "course", "lesson", "practice", "knowledge"] },
  { category: "Tasks", keywords: ["todo", "to-do", "task", "action item", "remember to", "need to", "must", "finish", "complete", "buy"] },
  { category: "Thoughts", keywords: ["idea", "think", "thought", "consider", "reflect", "journal", "note"] },
];

const highPriorityKeywords = ["urgent", "asap", "critical", "important", "immediately", "emergency", "overdue"];
const lowPriorityKeywords = ["someday", "maybe", "optional", "nice-to-have", "whenever", "if possible"];

function matches(text: string, keyword: string) {
  if (keyword.includes(" ") || keyword.includes("-")) return text.includes(keyword);
  return new RegExp(`\\b${keyword}\\b`, "i").test(text);
}

function nextWeekday(dayName: string) {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const target = days.indexOf(dayName.toLowerCase());
  const date = new Date();
  let daysAhead = target - date.getDay();
  if (daysAhead <= 0) daysAhead += 7;
  date.setDate(date.getDate() + daysAhead);
  date.setHours(0, 0, 0, 0);
  return date;
}

function detectDateTime(text: string) {
  const now = new Date();
  let date: Date | undefined;
  if (/\btomorrow\b/i.test(text)) {
    date = new Date(now);
    date.setDate(date.getDate() + 1);
  } else if (/\btoday\b/i.test(text)) {
    date = new Date(now);
  } else {
    const day = text.match(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i)?.[1];
    if (day) date = nextWeekday(day);
  }

  const timeMatch = text.match(/(\d{1,2}):(\d{2})|at\s+(\d{1,2})\s*(am|pm)/i);
  let time: string | undefined;
  if (timeMatch?.[1]) time = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  if (timeMatch?.[3]) {
    const hour = Number(timeMatch[3]);
    const adjusted = timeMatch[4].toLowerCase() === "pm" && hour !== 12 ? hour + 12 : hour === 12 && timeMatch[4].toLowerCase() === "am" ? 0 : hour;
    time = `${String(adjusted).padStart(2, "0")}:00`;
  }

  return { date, time };
}

export function analyzeOfflinePreview(content: string) {
  const normalized = content.toLowerCase();
  const matchedKeywords = [
    ...categoryKeywords.flatMap(({ keywords }) => keywords.filter((keyword) => matches(normalized, keyword))),
    ...highPriorityKeywords.filter((keyword) => matches(normalized, keyword)),
    ...lowPriorityKeywords.filter((keyword) => matches(normalized, keyword)),
  ];
  const category = categoryKeywords.find(({ keywords }) => keywords.some((keyword) => matches(normalized, keyword)))?.category ?? "Thoughts";
  const priority: PreviewPriority = highPriorityKeywords.some((keyword) => matches(normalized, keyword))
    ? "High"
    : lowPriorityKeywords.some((keyword) => matches(normalized, keyword))
      ? "Low"
      : "Medium";
  const title = content.replace(/\s+/g, " ").trim().split(/[.!?\n]/)[0] || "Untitled Note";
  const dateTime = detectDateTime(content);

  return {
    category,
    priority,
    title: title.length > 50 ? `${title.substring(0, 47).trimEnd()}...` : title,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    extractedDate: dateTime.date ? (dateTime.date.toDateString() === new Date().toDateString() ? "Today" : dateTime.date.toLocaleDateString()) : undefined,
    extractedTime: dateTime.time,
  };
}
