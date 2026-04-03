// src/components/TaskModal.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Task, CreateTaskPayload, TaskStatus, Priority } from '@/types/task';
import { X, Save, Plus } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateTaskPayload) => Promise<void>;
  task?: Task | null;
}

const defaultForm: CreateTaskPayload = {
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  dueDate: null,
};

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [form, setForm] = useState<CreateTaskPayload>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
      });
    } else {
      setForm(defaultForm);
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(17, 17, 27, 0.8)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg card p-6 animate-fade-in-up"
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--overlay1)' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
              Title <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              maxLength={200}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
              Description
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Add details (optional)"
              value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              maxLength={2000}
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
                Status
              </label>
              <select
                className="input-field cursor-pointer"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
                Priority
              </label>
              <select
                className="input-field cursor-pointer"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
              Due Date
            </label>
            <input
              type="date"
              className="input-field cursor-pointer"
              value={form.dueDate || ''}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value || null }))}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'var(--base)', borderTopColor: 'transparent' }} />
              ) : task ? (
                <Save size={15} />
              ) : (
                <Plus size={15} />
              )}
              {isLoading ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
