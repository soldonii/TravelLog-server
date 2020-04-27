import { Router } from 'express';

import findUserInDB from '../middlewares/findUserInDB';
import { login } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', findUserInDB, login);

export default authRouter;
