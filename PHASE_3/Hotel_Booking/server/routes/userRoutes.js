import {Router} from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchCitiies } from '../controllers/userController.js';
const userRouter=Router();

userRouter.get('/',protect,getUserData);
userRouter.post('/store-recent-search',protect,storeRecentSearchCitiies);

export default userRouter;