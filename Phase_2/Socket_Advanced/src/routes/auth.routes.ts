// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register); // ✅ Controller used correctly
router.post('/login', login);

export default router;