// src/components/StatsBar.tsx
import { Task } from '@/types/task';
import { CheckCircle2, Clock, Circle, ListTodo } from 'lucide-react';

interface StatsBarProps {
  tasks: Task[];
  total: number;
}

export default function StatsBar({ tasks, total }: StatsBarProps) {
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;

  const stats = [
    { icon: ListTodo, label: 'Total', value: total, color: 'var(--lavender)' },
    { icon: Circle, label: 'Pending', value: pending, color: 'var(--overlay1)' },
    { icon: Clock, label: 'In Progress', value: inProgress, color: 'var(--yellow)' },
    { icon: CheckCircle2, label: 'Completed', value: completed, color: 'var(--green)' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="card px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <p className="text-xl font-semibold leading-none" style={{ color: 'var(--text)' }}>
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--subtext0)' }}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
