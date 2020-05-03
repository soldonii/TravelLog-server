import { Router } from 'express';

import authenticateUser from '../middlewares/authenticate';
import { getCrawlingData, saveTravelData, sendInitialData } from '../controllers/travel.controller';

const travelRouter = Router();

travelRouter.post('/', authenticateUser, getCrawlingData);

travelRouter.get('/dashboard', authenticateUser, sendInitialData);

travelRouter.post('/dashboard', authenticateUser, saveTravelData);

export default travelRouter;
