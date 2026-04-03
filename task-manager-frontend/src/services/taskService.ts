// src/services/taskService.ts
import api from '@/lib/api';
import { Task, TasksResponse, TaskFilters, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';

export const taskService = {
  async getAll(filters: TaskFilters = {}): Promise<TasksResponse> {
    // Strip empty string values so they don't pollute query params
    const params: Record<string, string | number> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.order) params.order = filters.order;

    const { data } = await api.get<TasksResponse>('/tasks', { params });
    return data;
  },

  async getById(id: string): Promise<Task> {
    const { data } = await api.get<{ task: Task }>(`/tasks/${id}`);
    return data.task;
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await api.post<{ task: Task }>('/tasks', payload);
    return data.task;
  },

  async update(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}`, payload);
    return data.task;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggle(id: string): Promise<Task> {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}/toggle`);
    return data.task;
  },
};
