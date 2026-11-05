import React, { useState } from 'react';
import { Search, Edit3, Trash2, Check, X, AlertTriangle, Inbox } from 'lucide-react';

export default function StudentTable({
  students,
  isLoading,
  editingStudentId,
  onEdit,
  onDelete,
  isDeletingId,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Filter students based on search
  const filteredStudents = (students || []).filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const idMatch = s.id ? String(s.id).includes(term) : false;
    const nameMatch = s.name ? s.name.toLowerCase().includes(term) : false;
    const emailMatch = s.email ? s.email.toLowerCase().includes(term) : false;
    return idMatch || nameMatch || emailMatch;
  });

  const handleStartDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = async (id) => {
    await onDelete(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Table Top Toolbar */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Student Directory</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
              {filteredStudents.length} {filteredStudents.length === 1 ? 'record' : 'records'}
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            View, search, edit, and delete student records
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16 text-center">ID</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">Email Address</th>
              <th className="py-3.5 px-4 text-right w-52">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              // Loading Skeleton
              [1, 2, 3, 4].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td className="py-4 px-4 text-center">
                    <div className="h-4 w-8 bg-slate-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-44 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-8 w-28 bg-slate-200 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredStudents.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan="4" className="py-12 px-4 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center justify-center text-slate-400">
                    <div className="p-3 bg-slate-100 rounded-full mb-3">
                      <Inbox className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-700 font-semibold text-sm">
                      {searchTerm ? 'No matching students found' : 'No students registered yet'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchTerm
                        ? `Try searching for something else or clear the filter.`
                        : `Use the form on the left to add your first student record.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Student Rows
              filteredStudents.map((student) => {
                const isCurrentEditing = editingStudentId === student.id;
                const isConfirmingDelete = confirmDeleteId === student.id;
                const isBeingDeleted = isDeletingId === student.id;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors duration-150 ${
                      isCurrentEditing
                        ? 'bg-indigo-50/80 font-medium'
                        : isConfirmingDelete
                        ? 'bg-rose-50/70'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* ID */}
                    <td className="py-4 px-4 text-center font-mono text-xs text-slate-500 font-semibold">
                      #{student.id}
                    </td>

                    {/* Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCurrentEditing
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 block">
                            {student.name}
                          </span>
                          {isCurrentEditing && (
                            <span className="text-[11px] text-indigo-700 font-semibold">
                              Currently editing
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-slate-600">
                      <a
                        href={`mailto:${student.email}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {student.email}
                      </a>
                    </td>

                    {/* Actions (Non-modal: Inline confirmation) */}
                    <td className="py-4 px-4 text-right">
                      {isConfirmingDelete ? (
                        // Inline Delete Confirmation
                        <div className="flex items-center justify-end gap-1.5 animate-in fade-in duration-200">
                          <span className="text-xs text-rose-700 font-semibold flex items-center gap-1 mr-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            Delete?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(student.id)}
                            disabled={isBeingDeleted}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {isBeingDeleted ? (
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelDelete}
                            disabled={isBeingDeleted}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                            No
                          </button>
                        </div>
                      ) : (
                        // Standard Actions
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(student)}
                            className={`p-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                              isCurrentEditing
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600'
                            }`}
                            title="Edit Student"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartDelete(student.id)}
                            className="p-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
