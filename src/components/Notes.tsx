"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { StickyNote, Calendar as CalendarIcon } from "lucide-react";

interface NotesProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  isSelectedDateHoliday: boolean;
  toggleHoliday: (date: Date) => void;
  isDark: boolean;
}

export default function Notes({ currentMonth, startDate, endDate, isSelectedDateHoliday, toggleHoliday, isDark }: NotesProps) {
  let storageKey = `notes_month_${format(currentMonth, "yyyy-MM")}`;
  let title = "Monthly Memos";
  let subtitle = format(currentMonth, "MMMM yyyy");

  if (startDate && endDate) {
    storageKey = `notes_range_${format(startDate, "yyyy-MM-dd")}_${format(endDate, "yyyy-MM-dd")}`;
    title = "Trip / Event Notes";
    subtitle = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
  } else if (startDate) {
    storageKey = `notes_day_${format(startDate, "yyyy-MM-dd")}`;
    title = "Daily Note";
    subtitle = format(startDate, "MMMM d, yyyy");
  }

  return (
    <NotesEditor
      key={storageKey}
      storageKey={storageKey}
      title={title}
      subtitle={subtitle}
      startDate={startDate}
      endDate={endDate}
      isSelectedDateHoliday={isSelectedDateHoliday}
      toggleHoliday={toggleHoliday}
      isDark={isDark}
    />
  );
}

interface NotesEditorProps {
  storageKey: string;
  title: string;
  subtitle: string;
  startDate: Date | null;
  endDate: Date | null;
  isSelectedDateHoliday: boolean;
  toggleHoliday: (date: Date) => void;
  isDark: boolean;
}

function NotesEditor({
  storageKey,
  title,
  subtitle,
  startDate,
  endDate,
  isSelectedDateHoliday,
  toggleHoliday,
  isDark
}: NotesEditorProps) {
  const [noteContent, setNoteContent] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(storageKey) || "";
  });
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteContent(val);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setIsSaving(true);
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(storageKey, val);
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-slate-50" : "text-slate-950"}`}>
            {startDate ? <StickyNote size={18} /> : <CalendarIcon size={18} />}
            {title}
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
        </div>
        {startDate && !endDate && (
          <button
            className={`shrink-0 cursor-pointer rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              isSelectedDateHoliday
                ? isDark
                  ? "border-rose-400/30 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25"
                  : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                : isDark
                  ? "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
            type="button"
            onClick={() => toggleHoliday(startDate)}
          >
            {isSelectedDateHoliday ? "Holiday" : "Mark holiday"}
          </button>
        )}
      </div>
      
      <textarea
        className={`h-12 resize-none rounded-lg border p-2.5 text-sm leading-normal shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 sm:h-14 ${
          isDark
            ? "border-slate-700 bg-slate-900 text-slate-50"
            : "border-slate-200 bg-white text-slate-900"
        }`}
        placeholder="Jot down a memo, reminder, or plan..."
        value={noteContent}
        onChange={handleChange}
      />
      
      <div className={`mt-1 min-h-4 text-right text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {isSaving ? "Saving..." : noteContent ? <span className="text-emerald-600">Saved</span> : ""}
      </div>
    </div>
  );
}
