import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Notification from './components/Notification';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import studentService from './services/studentService';

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Auto-dismiss notification after 4.5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load students from backend
  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load students:', err);
      showNotification(
        'error',
        'Could not connect to the student API. Make sure the Spring Boot backend is running on port 8080.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Handle Add or Update submission
  const handleSubmit = async (studentData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        // Update operation
        const updated = await studentService.update(editingStudent.id, studentData);
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? (updated && updated.id ? updated : { ...s, ...studentData }) : s))
        );
        showNotification('success', `Student "${studentData.name}" was successfully updated.`);
        setEditingStudent(null);
      } else {
        // Create operation
        await studentService.create(studentData);
        // Refresh list to ensure we have the correct DB-generated ID
        await loadStudents();
        showNotification('success', `Student "${studentData.name}" has been registered.`);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      let errMsg = 'Failed to save student record. Please verify server connection.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else if (err.response.data.message) {
          errMsg = err.response.data.message;
        } else if (err.response.data.error) {
          errMsg = `Server error: ${err.response.data.error}`;
        }
      } else if (err.message) {
        errMsg = `${err.message}. Please verify the Spring Boot backend is running on port 8080.`;
      }
      showNotification('error', errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete operation
  const handleDelete = async (id) => {
    setIsDeletingId(id);
    try {
      await studentService.delete(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (editingStudent && editingStudent.id === id) {
        setEditingStudent(null);
      }
      showNotification('success', `Student #${id} was deleted successfully.`);
    } catch (err) {
      console.error('Delete failed:', err);
      showNotification('error', `Failed to delete student #${id}. Server error.`);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <Header
        totalCount={students.length}
        onRefresh={loadStudents}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Inline Notification Banner */}
        {notification && (
          <Notification
            notification={notification}
            onDismiss={dismissNotification}
          />
        )}

        {/* Responsive Dual-Panel Layout (No Modal) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Card (Add/Edit) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <StudentForm
              editingStudent={editingStudent}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingStudent(null)}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Directory Table */}
          <div className="lg:col-span-8">
            <StudentTable
              students={students}
              isLoading={isLoading}
              editingStudentId={editingStudent ? editingStudent.id : null}
              onEdit={(student) => {
                setEditingStudent(student);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={handleDelete}
              isDeletingId={isDeletingId}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Student CRUD Application &bull; Vite React &bull; Tailwind CSS &bull; Spring Boot Backend
        </div>
      </footer>
    </div>
  );
}
