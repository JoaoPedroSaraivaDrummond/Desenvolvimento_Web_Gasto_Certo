import { Router } from 'express';
import { addExpense, getSummary, upsertSalary } from '../controllers/financeController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.post('/salary', upsertSalary);
router.post('/expenses', addExpense);
router.get('/summary', getSummary);

export default router;


