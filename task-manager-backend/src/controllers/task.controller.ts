import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
type TaskStatus = typeof VALID_STATUSES[number];
type Priority = typeof VALID_PRIORITIES[number];

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';

    const where: any = { userId };
    if (status && VALID_STATUSES.includes(status as TaskStatus)) {
      where.status = status;
    }
    if (priority && VALID_PRIORITIES.includes(priority as Priority)) {
      where.priority = priority;
    }
    if (search) {
      where.title = { contains: search };
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'];
    const orderBy = allowedSortFields.includes(sortBy)
      ? { [sortBy]: order }
      : { createdAt: 'desc' as const };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        userId: req.user!.userId,
      },
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!task) throw new AppError('Task not found', 404);

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!existing) throw new AppError('Task not found', 404);

    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!existing) throw new AppError('Task not found', 404);

    await prisma.task.delete({ where: { id: req.params.id } });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}


export async function toggleTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!existing) throw new AppError('Task not found', 404);

    const nextStatus: Record<TaskStatus, TaskStatus> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'PENDING',
    };

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status: nextStatus[existing.status as TaskStatus] },
    });

    res.json({ task });
  } catch (err) {
    next(err);
  }
}