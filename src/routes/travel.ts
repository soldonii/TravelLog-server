import { Router } from 'express';

import authenticateUser from '../middlewares/authenticate';
import {
  getKayakData,
  getAirbnbData,
  sendAllTravelData
} from '../controllers/travel.controller';

const travelRouter = Router();

travelRouter.post('/kayak', authenticateUser, getKayakData);

travelRouter.post('/airbnb', authenticateUser, getAirbnbData);

travelRouter.get('/', authenticateUser, sendAllTravelData);

export default travelRouter;
