import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use(authenticate);

const taskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be 1–200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be under 2000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
];

const createValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be 1–200 characters'),
  ...taskValidation.slice(1),
];

// GET /tasks  — list with pagination, filter, search
router.get('/', getTasks);

// POST /tasks — create new task
router.post('/', createValidation, createTask);

// GET /tasks/:id
router.get('/:id', getTaskById);

// PATCH /tasks/:id
router.patch('/:id', taskValidation, updateTask);

// DELETE /tasks/:id
router.delete('/:id', deleteTask);

// PATCH /tasks/:id/toggle
router.patch('/:id/toggle', toggleTask);

export default router;
