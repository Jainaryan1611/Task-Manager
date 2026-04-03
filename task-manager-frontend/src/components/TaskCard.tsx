// src/components/TaskCard.tsx
'use client';

import { Task } from '@/types/task';
import { format, isPast, parseISO } from 'date-fns';
import { Calendar, Edit2, Trash2, ArrowRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Circle,
    color: 'var(--overlay1)',
    bg: 'rgba(108, 112, 134, 0.15)',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: Clock,
    color: 'var(--yellow)',
    bg: 'rgba(249, 226, 175, 0.12)',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'var(--green)',
    bg: 'rgba(166, 227, 161, 0.12)',
  },
};

const priorityConfig = {
  LOW: { label: 'Low', color: 'var(--teal)', dot: '#94e2d5' },
  MEDIUM: { label: 'Medium', color: 'var(--yellow)', dot: '#f9e2af' },
  HIGH: { label: 'High', color: 'var(--red)', dot: '#f38ba8' },
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;
  const isOverdue = task.dueDate && task.status !== 'COMPLETED' && isPast(parseISO(task.dueDate));

  return (
    <div
      className={clsx(
        'card p-5 group transition-all duration-200 hover:border-opacity-60 animate-fade-in-up',
        task.status === 'COMPLETED' && 'opacity-75'
      )}
      style={{ borderColor: task.status === 'COMPLETED' ? 'var(--surface0)' : undefined }}
    >
      <div className="flex items-start gap-3">
        {/* Status toggle button */}
        <button
          onClick={() => onToggle(task)}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
          title={`Current: ${status.label}. Click to advance status.`}
        >
          <StatusIcon size={20} style={{ color: status.color }} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={clsx(
                'font-medium text-sm leading-snug',
                task.status === 'COMPLETED' && 'line-through'
              )}
              style={{ color: task.status === 'COMPLETED' ? 'var(--overlay1)' : 'var(--text)' }}
            >
              {task.title}
            </h3>

            {/* Actions — visible on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--subtext0)' }}
                title="Edit task"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--red)' }}
                title="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--subtext0)' }}>
              {task.description}
            </p>
          )}

          {/* Badges row */}
          <div className="flex items-center flex-wrap gap-2 mt-3">
            {/* Status badge */}
            <span
              className="badge text-xs"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>

            {/* Priority badge */}
            <span className="badge" style={{ background: 'var(--surface0)', color: priority.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: priority.dot }} />
              {priority.label}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span
                className="badge"
                style={{
                  background: isOverdue ? 'rgba(243,139,168,0.12)' : 'var(--surface0)',
                  color: isOverdue ? 'var(--red)' : 'var(--subtext0)',
                }}
              >
                <Calendar size={10} />
                {format(parseISO(task.dueDate), 'MMM d')}
                {isOverdue && ' · Overdue'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cycle hint on hover */}
      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(task)}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: 'var(--overlay1)' }}
        >
          <ArrowRight size={10} />
          <span>
            {task.status === 'PENDING' && 'Mark In Progress'}
            {task.status === 'IN_PROGRESS' && 'Mark Completed'}
            {task.status === 'COMPLETED' && 'Reset to Pending'}
          </span>
        </button>
      </div>
    </div>
  );
}
