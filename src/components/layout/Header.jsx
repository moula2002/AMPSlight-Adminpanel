import React from 'react';

export default function Header({ onMenuClick }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-base md:text-lg font-bold text-slate-800 truncate">AMPS Admin Panel</h2>
      </div>
      <div className="bg-slate-100 px-4 py-2 rounded-full text-xs md:text-sm font-bold text-slate-600 border border-slate-200 shrink-0">
        Admin User
      </div>
    </header>
  );
}
