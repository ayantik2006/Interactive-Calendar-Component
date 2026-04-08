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
}

export default function Notes({ currentMonth, startDate, endDate, isSelectedDateHoliday, toggleHoliday }: NotesProps) {
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
}

function NotesEditor({
  storageKey,
  title,
  subtitle,
  startDate,
  endDate,
  isSelectedDateHoliday,
  toggleHoliday
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
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-950">
            {startDate ? <StickyNote size={18} /> : <CalendarIcon size={18} />}
            {title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-500">{subtitle}</p>
        </div>
        {startDate && !endDate && (
          <button
            className={`shrink-0 cursor-pointer rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              isSelectedDateHoliday
                ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
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
        className="h-16 resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm leading-normal text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 sm:h-20"
        placeholder="Jot down a memo, reminder, or plan..."
        value={noteContent}
        onChange={handleChange}
      />
      
      <div className="mt-1 min-h-4 text-right text-xs text-slate-500">
        {isSaving ? "Saving..." : noteContent ? <span className="text-emerald-600">Saved</span> : ""}
      </div>
    </div>
  );
}
