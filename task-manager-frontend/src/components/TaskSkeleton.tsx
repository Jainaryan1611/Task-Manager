// src/components/TaskSkeleton.tsx
export default function TaskSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="skeleton w-5 h-5 rounded-full mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
          <div className="flex gap-2 mt-3">
            <div className="skeleton h-5 w-16 rounded-lg" />
            <div className="skeleton h-5 w-14 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
