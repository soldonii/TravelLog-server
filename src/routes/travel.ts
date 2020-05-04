import { Router } from 'express';

import authenticateUser from '../middlewares/authenticate';
import {
  getCrawlingData
} from '../controllers/travel.controller';

const travelRouter = Router();

travelRouter.post('/', authenticateUser, getCrawlingData);

// travel.get 하면 기록되어 있는 모든 여행들 정보 가져오기.

export default travelRouter;
