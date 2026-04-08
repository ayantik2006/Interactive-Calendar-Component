"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import CalendarGrid from "./CalendarGrid";
import Notes from "./Notes";

export default function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="flex max-h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-950/5 sm:max-h-[calc(100vh-2rem)]">
      
      <div className="flex flex-col border-b border-slate-200 bg-slate-50">
        <div className="relative h-28 shrink-0 overflow-hidden sm:h-32">
          <Image
            src="/calendar_hero.jpg" 
            alt="Calendar Hero" 
            fill
            sizes="(min-width: 440px) 440px, 100vw"
            className="object-cover transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-white/5" />
          
          <div className="absolute bottom-4 left-5 z-[1] text-white">
            <div className="text-2xl leading-none font-semibold tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              {format(currentMonth, "MMMM")}
            </div>
            <div className="text-sm text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              {format(currentMonth, "yyyy")}
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4">
          <Notes 
            currentMonth={currentMonth} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </div>

      <div className="flex flex-col bg-white p-4">
        <CalendarGrid 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

    </div>
  );
}
