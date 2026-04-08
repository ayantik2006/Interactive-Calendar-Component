"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { format } from "date-fns";
import CalendarGrid from "./CalendarGrid";
import Notes from "./Notes";

type ThemeMode = "light" | "dark" | "system";

const THEME_KEY = "calendar_theme";
const HOLIDAY_DATES_KEY = "holiday_dates";
const THEME_CHANGE_EVENT = "calendar-theme-change";

function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "system";

  const savedTheme = localStorage.getItem(THEME_KEY);
  return savedTheme === "light" || savedTheme === "dark" || savedTheme === "system" ? savedTheme : "system";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const themeMode = useSyncExternalStore<ThemeMode>(subscribeToThemeChanges, getStoredThemeMode, () => "system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [holidayDates, setHolidayDates] = useState<Set<string>>(new Set());

  const toggleHoliday = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");

    setHolidayDates((previousHolidayDates) => {
      const nextHolidayDates = new Set(previousHolidayDates);

      if (nextHolidayDates.has(dateKey)) {
        nextHolidayDates.delete(dateKey);
      } else {
        nextHolidayDates.add(dateKey);
      }

      localStorage.setItem(HOLIDAY_DATES_KEY, JSON.stringify([...nextHolidayDates]));
      return nextHolidayDates;
    });
  };

  const selectedDateKey = startDate && !endDate ? format(startDate, "yyyy-MM-dd") : null;
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const loadHolidayDates = () => {
      const savedHolidayDates = localStorage.getItem(HOLIDAY_DATES_KEY);

      if (!savedHolidayDates) return;

      try {
        const parsedHolidayDates = JSON.parse(savedHolidayDates) as unknown;

        if (Array.isArray(parsedHolidayDates)) {
          setHolidayDates(new Set(parsedHolidayDates.filter((date): date is string => typeof date === "string")));
        }
      } catch {
        localStorage.removeItem(HOLIDAY_DATES_KEY);
      }
    };

    loadHolidayDates();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const nextResolvedTheme: "light" | "dark" = themeMode === "system" ? getSystemTheme() : themeMode;

      setResolvedTheme(nextResolvedTheme);
      localStorage.setItem(THEME_KEY, themeMode);
      document.documentElement.dataset.theme = nextResolvedTheme;
      document.documentElement.style.colorScheme = nextResolvedTheme;
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [themeMode]);

  const handleTodayClick = () => {
    const today = new Date();

    setCurrentMonth(today);
    setStartDate(today);
    setEndDate(null);
  };

  const handleClearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    localStorage.setItem(THEME_KEY, mode);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <div className={`flex max-h-[calc(100vh-1rem)] w-full flex-col overflow-x-hidden overflow-y-auto rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 sm:max-h-[calc(100vh-1.5rem)] ${
      isDark
        ? "border-slate-800/80 bg-slate-950 text-slate-50 ring-white/10"
        : "border-slate-200/80 bg-white text-slate-950 ring-slate-950/5"
    }`}>
      
      <div className={`flex flex-col border-b ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
        <div className="relative h-20 shrink-0 overflow-hidden sm:h-24">
          <Image
            src="/calendar_hero.jpg" 
            alt="Calendar Hero" 
            fill
            sizes="(min-width: 440px) 440px, 100vw"
            className="object-cover transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-white/5" />
          
          <div className="absolute top-3 right-3 z-[2] flex rounded-full border border-white/25 bg-white/15 p-0.5 text-[0.65rem] font-medium text-white/90 shadow-sm backdrop-blur-md">
            {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
              <button
                className={`cursor-pointer rounded-full px-1.5 py-0.5 capitalize transition-colors ${
                  themeMode === mode ? "bg-white text-slate-950" : "hover:bg-white/15"
                }`}
                key={mode}
                onClick={() => handleThemeChange(mode)}
                type="button"
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="absolute bottom-3 left-4 z-[1] text-white">
            <div className="text-xl leading-none font-semibold tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              {format(currentMonth, "MMMM")}
            </div>
            <div className="text-sm text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              {format(currentMonth, "yyyy")}
            </div>
          </div>
        </div>

        <div className="flex flex-col p-3">
          <Notes 
            currentMonth={currentMonth} 
            startDate={startDate} 
            endDate={endDate} 
            isSelectedDateHoliday={selectedDateKey ? holidayDates.has(selectedDateKey) : false}
            toggleHoliday={toggleHoliday}
            isDark={isDark}
          />
        </div>
      </div>

      <div className={`flex flex-col p-3 ${isDark ? "bg-slate-950" : "bg-white"}`}>
        <CalendarGrid 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          holidayDates={holidayDates}
          onTodayClick={handleTodayClick}
          onClearSelection={handleClearSelection}
          isDark={isDark}
        />
      </div>

    </div>
  );
}
