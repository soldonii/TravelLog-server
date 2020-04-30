import { Router } from 'express';

import authenticateUser from '../middlewares/authenticate';
import { getCrawlingData } from '../controllers/travel.controller';

const travelRouter = Router();

travelRouter.post('/', authenticateUser, getCrawlingData);

export default travelRouter;
