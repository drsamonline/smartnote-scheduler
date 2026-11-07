import { Loader2 } from "lucide-react";

interface NotePreviewProps {
  isAnalyzing: boolean;
  onCategoryChange?: (category: string) => void;
  onPriorityChange?: (priority: string) => void;
  onReminderDateChange?: (date: string) => void;
  onReminderTimeChange?: (time: string) => void;
  preview?: {
    category: string;
    priority: string;
    title: string;
    matchedKeywords?: string[];
    extractedDate?: string;
    extractedTime?: string;
    reminderDate?: string;
    reminderTime?: string;
  };
}

export function NotePreview({ isAnalyzing, preview, onCategoryChange, onPriorityChange, onReminderDateChange, onReminderTimeChange }: NotePreviewProps) {
  if (!isAnalyzing && !preview) return null;

  return (
    <div className="border-2 border-red-600 p-4 bg-gray-900 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3"><p className="text-xs font-bold tracking-widest text-red-600">LOCAL REVIEW BEFORE SAVE</p><span className="text-[10px] font-bold tracking-widest text-gray-500">KEYWORD ENGINE</span></div>
      
      {isAnalyzing ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-bold">ANALYZING...</span>
        </div>
      ) : preview ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">TITLE</p>
            <p className="text-white font-bold">{preview.title}</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <label className="block"><span className="text-xs font-bold text-gray-400 mb-1 block">CATEGORY · EDIT BEFORE SAVE</span><select value={preview.category} onChange={(event) => onCategoryChange?.(event.target.value)} className="bg-gray-950 border border-white/60 px-3 py-1 text-xs font-bold text-white">{["Tasks", "Deadlines", "Schedule", "Thoughts", "Learning"].map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="block"><span className="text-xs font-bold text-gray-400 mb-1 block">PRIORITY · EDIT BEFORE SAVE</span><select value={preview.priority} onChange={(event) => onPriorityChange?.(event.target.value)} className="bg-gray-950 border border-white/60 px-3 py-1 text-xs font-bold text-white">{["Low", "Medium", "High"].map((priority) => <option key={priority}>{priority}</option>)}</select></label>
          </div>

          {preview.matchedKeywords && preview.matchedKeywords.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 mb-1">DETECTED KEYWORDS</p>
              <div className="flex flex-wrap gap-2">{preview.matchedKeywords.map((keyword) => <span key={keyword} className="border border-amber-500/70 bg-amber-950/30 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-200">{keyword}</span>)}</div>
            </div>
          )}

          {preview.extractedDate && (
            <div>
              <p className="text-xs font-bold text-gray-400 mb-1">DETECTED DATE</p>
              <p className="text-white font-bold text-sm">{preview.extractedDate}</p>
            </div>
          )}
          {preview.extractedTime && <p className="text-white font-bold text-sm">TIME: {preview.extractedTime}</p>}

          {(preview.category === "Deadlines" || preview.category === "Schedule") && (
            <div className={`border-2 p-3 ${preview.extractedDate || preview.extractedTime ? "border-green-500 bg-green-950/30" : "border-amber-500 bg-amber-950/30"}`}>
              <p className="text-xs font-bold tracking-widest text-gray-300 mb-2">REMINDER PREVIEW</p>
              {preview.reminderDate && preview.reminderTime ? (
                <>
                  <p className="text-lg font-bold text-white">{preview.category === "Deadlines" ? "DEADLINE" : "SCHEDULED EVENT"}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <label className="block"><span className="text-[10px] font-bold tracking-widest text-gray-400 block mb-1">DATE · EDIT</span><input type="date" value={preview.reminderDate || ""} onChange={(event) => onReminderDateChange?.(event.target.value)} className="bg-gray-950 border border-green-500 px-2 py-1 text-sm font-bold text-white" /></label>
                    <label className="block"><span className="text-[10px] font-bold tracking-widest text-gray-400 block mb-1">TIME · EDIT</span><input type="time" value={preview.reminderTime || ""} onChange={(event) => onReminderTimeChange?.(event.target.value)} className="bg-gray-950 border border-green-500 px-2 py-1 text-sm font-bold text-white" /></label>
                  </div>
                  <p className="mt-2 text-[10px] font-bold tracking-widest text-green-400">NOTIFICATION: 1 HOUR BEFORE</p>
                </>
              ) : (
                <><p className="text-sm font-bold text-amber-200">DATE AND TIME REQUIRED — enter both values below to create a reminder.</p><div className="flex flex-wrap gap-3 mt-3"><label className="block"><span className="text-[10px] font-bold tracking-widest text-gray-400 block mb-1">DATE · EDIT</span><input type="date" value={preview.reminderDate || ""} onChange={(event) => onReminderDateChange?.(event.target.value)} className="bg-gray-950 border border-amber-500 px-2 py-1 text-sm font-bold text-white" /></label><label className="block"><span className="text-[10px] font-bold tracking-widest text-gray-400 block mb-1">TIME · EDIT</span><input type="time" value={preview.reminderTime || ""} onChange={(event) => onReminderTimeChange?.(event.target.value)} className="bg-gray-950 border border-amber-500 px-2 py-1 text-sm font-bold text-white" /></label></div></>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
