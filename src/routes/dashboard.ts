import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';

import {
  saveTravelData,
  sendInitialData,
  registerSpending,
  deleteSpending
} from '../controllers/dashboard.controller';

const dashboardRouter = Router();

dashboardRouter.get('/', authenticateUser, sendInitialData);

dashboardRouter.post('/', authenticateUser, saveTravelData);

dashboardRouter.put('/', authenticateUser, registerSpending);

dashboardRouter.delete('/', authenticateUser, deleteSpending);

export default dashboardRouter;
