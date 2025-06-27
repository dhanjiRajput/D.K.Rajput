import {Router} from 'express';
import AuthController from '../Controllers/authController.js';
import ProfileController from '../Controllers/profileController.js';
import authMiddleware from '../Middleware/authenticate.js';
import uploads from '../utils/helper.js'; 
import NewsController from '../Controllers/newsController.js';

const router =Router();

router.post('/auth/register',AuthController.register);
router.post('/auth/login',AuthController.login);


router.get('/profile',authMiddleware,ProfileController.index);
router.put('/profile/:id',authMiddleware,uploads.single('profile'),ProfileController.update); 


router.get('/news',NewsController.index);
router.post('/news',NewsController.store);
router.get('/news/:id',NewsController.show);
router.put('/news/:id',NewsController.update);
router.delete('/news/:id',NewsController.destroy);

export default router