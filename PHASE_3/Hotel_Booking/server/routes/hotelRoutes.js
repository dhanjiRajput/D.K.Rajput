import {Router} from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerHotel } from '../controllers/hotelController.js';
const hotelRoutes=Router();

hotelRoutes.post('/',protect,registerHotel);

export default hotelRoutes;