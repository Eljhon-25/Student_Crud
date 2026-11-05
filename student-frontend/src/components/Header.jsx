import React from 'react';
import { GraduationCap, Users, RefreshCw } from 'lucide-react';

export default function Header({ totalCount, onRefresh, isLoading }) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Student Management Portal
              </h1>
              <p className="text-sm text-slate-500">
                Full CRUD operations powered by Vite React & Spring Boot API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-medium text-sm border border-slate-200">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Total Students:</span>
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {totalCount}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh list"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
