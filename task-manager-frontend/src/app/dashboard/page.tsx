// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, TaskFilters, CreateTaskPayload } from '@/types/task';
import { taskService } from '@/services/taskService';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import DeleteModal from '@/components/DeleteModal';
import TaskSkeleton from '@/components/TaskSkeleton';
import StatsBar from '@/components/StatsBar';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import {
  Plus, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ClipboardList, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';

const LIMIT = 9;

export default function DashboardPage() {
  const { user } = useAuth();

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    limit: LIMIT,
    status: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [searchInput, setSearchInput] = useState('');
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // Modals
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task | null }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{ task: Task | null; isLoading: boolean }>({
    task: null,
    isLoading: false,
  });

  // Fetch tasks whenever filters change
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getAll(filters);
      setTasks(data.tasks);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      const e = err as AxiosError<{ error: string }>;
      toast.error(e.response?.data?.error || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilters(f => ({ ...f, search: value, page: 1 }));
    }, 400);
  };

  // Filter helpers
  const setFilter = (key: keyof TaskFilters, value: string | number) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ page: 1, limit: LIMIT, status: '', priority: '', search: '', sortBy: 'createdAt', order: 'desc' });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  // CRUD handlers
  const handleSaveTask = async (payload: CreateTaskPayload) => {
    try {
      if (taskModal.task) {
        await taskService.update(taskModal.task.id, payload);
        toast.success('Task updated');
      } else {
        await taskService.create(payload);
        toast.success('Task created');
      }
      fetchTasks();
    } catch (err) {
      const e = err as AxiosError<{ error: string; errors?: Array<{ msg: string }> }>;
      const msg = e.response?.data?.errors?.[0]?.msg || e.response?.data?.error || 'Failed to save task';
      toast.error(msg);
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.task) return;
    setDeleteModal(d => ({ ...d, isLoading: true }));
    try {
      await taskService.delete(deleteModal.task.id);
      toast.success('Task deleted');
      setDeleteModal({ task: null, isLoading: false });
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
      setDeleteModal(d => ({ ...d, isLoading: false }));
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      const updated = await taskService.toggle(task.id);
      setTasks(ts => ts.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      toast.error('Failed to update task status');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
            Good day, <span style={{ color: 'var(--mauve)' }}>{user?.username}</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--subtext0)' }}>
            {total === 0 ? 'No tasks yet. Create your first one!' : `You have ${total} task${total !== 1 ? 's' : ''} in total.`}
          </p>
        </div>
        <button
          onClick={() => setTaskModal({ open: true, task: null })}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <StatsBar tasks={tasks} total={total} />

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--overlay1)' }} />
          <input
            type="text"
            className="input-field pl-10 pr-10"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
          />
          {searchInput && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--overlay1)' }}
              onClick={() => handleSearchChange('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          className="input-field sm:w-40 cursor-pointer"
          value={filters.status}
          onChange={e => setFilter('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority filter */}
        <select
          className="input-field sm:w-36 cursor-pointer"
          value={filters.priority}
          onChange={e => setFilter('priority', e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {/* Sort */}
        <select
          className="input-field sm:w-44 cursor-pointer"
          value={`${filters.sortBy}:${filters.order}`}
          onChange={e => {
            const [sortBy, order] = e.target.value.split(':');
            setFilters(f => ({ ...f, sortBy, order: order as 'asc' | 'desc', page: 1 }));
          }}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="dueDate:asc">Due Date ↑</option>
          <option value="dueDate:desc">Due Date ↓</option>
          <option value="title:asc">Title A–Z</option>
          <option value="title:desc">Title Z–A</option>
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn-ghost flex items-center gap-2 flex-shrink-0"
          >
            <SlidersHorizontal size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Task grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <TaskSkeleton key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--surface0)' }}>
            <ClipboardList size={28} style={{ color: 'var(--overlay1)' }} />
          </div>
          <h3 className="font-medium mb-1" style={{ color: 'var(--text)' }}>
            {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
          </h3>
          <p className="text-sm" style={{ color: 'var(--subtext0)' }}>
            {hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Click "New Task" to create your first task'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-ghost mt-4 text-sm">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={t => setTaskModal({ open: true, task: t })}
              onDelete={t => setDeleteModal({ task: t, isLoading: false })}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm" style={{ color: 'var(--subtext0)' }}>
            Page {filters.page} of {totalPages} · {total} tasks
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
              className={clsx('btn-ghost flex items-center gap-1', filters.page === 1 && 'opacity-40 cursor-not-allowed')}
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <button
              disabled={filters.page === totalPages}
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
              className={clsx('btn-ghost flex items-center gap-1', filters.page === totalPages && 'opacity-40 cursor-not-allowed')}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={taskModal.open}
        onClose={() => setTaskModal({ open: false })}
        onSave={handleSaveTask}
        task={taskModal.task}
      />
      <DeleteModal
        task={deleteModal.task}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ task: null, isLoading: false })}
        isLoading={deleteModal.isLoading}
      />
    </>
  );
}
