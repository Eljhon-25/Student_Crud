import React, { useState, useEffect } from 'react';
import { User, Mail, UserPlus, Save, X, AlertCircle } from 'lucide-react';

export default function StudentForm({ editingStudent, onSubmit, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        email: editingStudent.email || '',
      });
      setErrors({});
    } else {
      setFormData({ name: '', email: '' });
      setErrors({});
    }
  }, [editingStudent]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
    });
  };

  const isEditing = Boolean(editingStudent);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs ${
        isEditing ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'
      }`}
    >
      {/* Form Header */}
      <div className={`p-5 border-b rounded-t-2xl ${isEditing ? 'bg-indigo-50/60 border-indigo-100' : 'border-slate-100 bg-slate-50/60'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isEditing ? (
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs">
                <Save className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 bg-slate-800 text-white rounded-lg shadow-xs">
                <UserPlus className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? `Edit Student (ID: #${editingStudent.id})` : 'Add New Student'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update the student credentials below' : 'Fill in the information to register a student'}
              </p>
            </div>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-xs font-semibold px-2.5 py-1 text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Juan Dela Cruz"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="e.g. juan.delacruz@school.edu"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isEditing
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300'
                : 'bg-slate-900 hover:bg-slate-800 focus:ring-2 focus:ring-slate-300'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEditing ? 'Updating...' : 'Saving...'}
              </span>
            ) : isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Update Student
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Save Student
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
