"use client";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-7xl px-4 pt-10">
      <div className="glass-soft rounded-2xl px-4 py-3.5 text-center">
        <p className="text-[11.5px] text-slate-400">
          © {year} <span className="font-semibold text-slate-200">akthethoughtson</span>
          <span className="mx-1.5 text-slate-600">·</span>
          People — for the people, by the people
        </p>
      </div>
    </footer>
  );
}
