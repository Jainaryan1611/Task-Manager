// src/components/DeleteModal.tsx
'use client';

import { Task } from '@/types/task';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  task: Task | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function DeleteModal({ task, onConfirm, onCancel, isLoading }: DeleteModalProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(17, 17, 27, 0.8)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm card p-6 animate-fade-in-up" style={{ zIndex: 1 }}>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg"
          style={{ color: 'var(--overlay1)' }}
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(243,139,168,0.15)' }}>
            <AlertTriangle size={18} style={{ color: 'var(--red)' }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Delete Task</h2>
            <p className="text-xs" style={{ color: 'var(--subtext0)' }}>This cannot be undone</p>
          </div>
        </div>

        <p className="text-sm mb-5" style={{ color: 'var(--subtext1)' }}>
          Are you sure you want to delete{' '}
          <span className="font-medium" style={{ color: 'var(--text)' }}>
            &ldquo;{task.title}&rdquo;
          </span>?
        </p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'var(--red)', borderTopColor: 'transparent' }} />
            ) : (
              <Trash2 size={14} />
            )}
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
