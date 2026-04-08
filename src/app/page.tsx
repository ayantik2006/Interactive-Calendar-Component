import CalendarWidget from "@/components/CalendarWidget";

export default function Home() {
  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden bg-[image:var(--page-bg)] p-2 sm:p-3">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="pointer-events-none absolute top-8 h-48 w-[32rem] rounded-full bg-[var(--page-orb)] blur-3xl" />
      
      <div className="relative z-[1] w-full max-w-[390px]">
        <CalendarWidget />
      </div>
    </main>
  );
}
