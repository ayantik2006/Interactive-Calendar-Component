"use client";

import { useState } from "react";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isWithinInterval, isAfter, isBefore 
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarGridProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

export default function CalendarGrid({
  currentMonth, setCurrentMonth, startDate, setStartDate, endDate, setEndDate
}: CalendarGridProps) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0); 

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDateGrid = startOfWeek(monthStart);
  const endDateGrid = endOfWeek(monthEnd);

  const daysInGrid = eachDayOfInterval({
    start: startDateGrid,
    end: endDateGrid
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (day: Date) => {
    if (!startDate) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(day, startDate)) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    } else if (startDate && endDate) {
      setStartDate(day);
      setEndDate(null);
    }
  };

  const handleMouseEnter = (day: Date) => {
    if (startDate && !endDate) {
      setHoverDate(day);
    }
  };

  const handleMouseLeave = () => {
    if (startDate && !endDate) {
      setHoverDate(null);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2 text-lg font-semibold tracking-tight text-slate-950">
          <span>{format(currentMonth, "MMMM")}</span>
          <span className="text-slate-500">{format(currentMonth, "yyyy")}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50" onClick={handlePrevMonth}>
            <ChevronLeft size={18} />
          </button>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50" onClick={handleNextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="pb-2 text-center text-xs font-medium text-slate-500">{day}</div>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonth.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
            className="grid grid-cols-7 gap-1"
            onMouseLeave={handleMouseLeave}
          >
            {daysInGrid.map(day => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());
              const isStart = startDate && isSameDay(day, startDate);
              const isEnd = endDate && isSameDay(day, endDate);
              
              const isBetween = startDate && endDate 
                ? isWithinInterval(day, { start: startDate, end: endDate }) && !isStart && !isEnd
                : startDate && hoverDate && isAfter(hoverDate, startDate)
                  ? isWithinInterval(day, { start: startDate, end: hoverDate }) && !isStart && !isSameDay(day, hoverDate)
                  : false;

              let className = "relative flex aspect-square cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm font-medium text-slate-800 transition-colors duration-200 hover:bg-slate-100";
              if (!isCurrentMonth) className += " !text-slate-300 font-normal hover:bg-transparent";
              if (isToday) className += " border border-blue-400 text-blue-600";
              if (isBetween) className += " rounded-none !bg-blue-50 text-blue-700 ring-1 ring-blue-100 hover:!bg-blue-100";
              if (isStart || isEnd || (startDate && hoverDate && isSameDay(day, hoverDate) && isAfter(hoverDate, startDate))) {
                 className += " !bg-slate-950 text-white shadow-sm hover:!bg-slate-800";
              }
              if (isStart && (endDate || hoverDate)) className += " rounded-r-none";
              if (isEnd || (startDate && hoverDate && isSameDay(day, hoverDate) && isAfter(hoverDate, startDate))) className += " rounded-l-none";

              return (
                <div
                  key={day.toString()}
                  className={className}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => handleMouseEnter(day)}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
