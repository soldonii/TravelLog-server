import { Router } from 'express';

import authenticateUser from '../middlewares/authenticate';
import {
  getCrawlingData,
  saveTravelData,
  sendInitialData,
  registerSpending
} from '../controllers/travel.controller';

const travelRouter = Router();

travelRouter.post('/', authenticateUser, getCrawlingData);

travelRouter.get('/dashboard', authenticateUser, sendInitialData);

travelRouter.post('/dashboard', authenticateUser, saveTravelData);

travelRouter.put('/dashboard', authenticateUser, registerSpending);

export default travelRouter;
