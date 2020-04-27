import { Router } from 'express';

import findUserInDB from '../middlewares/findUserInDB';
import { login } from '../controllers/auth.controller';

const router = Router();

router.post('/login', findUserInDB, login);

export default router;
