import {Router} from 'express';
import AuthController from '../Controllers/authController.js';
import ProfileController from '../Controllers/profileController.js';
import authMiddleware from '../Middleware/authenticate.js';
import uploads from '../utils/helper.js'; 
import NewsController from '../Controllers/newsController.js';
import redisCache from '../utils/redisClient.js';

const router =Router();

router.post('/auth/register',AuthController.register);
router.post('/auth/login',AuthController.login);


router.get('/profile',authMiddleware,ProfileController.index);
router.put('/profile/:id',authMiddleware,uploads.single('profile'),ProfileController.update); 


router.get('/news',redisCache.route(),NewsController.index);
router.post('/news',authMiddleware,uploads.single('image'),NewsController.store);
router.get('/news/:id',NewsController.show);
router.put('/news/:id',authMiddleware,uploads.single('image'),NewsController.update);
router.delete('/news/:id',authMiddleware,NewsController.destroy);

export default router