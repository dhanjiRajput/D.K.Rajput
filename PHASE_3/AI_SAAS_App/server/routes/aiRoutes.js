import express from 'express';
import { auth } from '../Middleware/auth.js';
import { generateArticle, generateBlogTitle, generateImage } from '../controllers/aiController.js';

const aiRoutes=express.Router();

aiRoutes.post('/generate-article',auth,generateArticle);
aiRoutes.post('/generate-blog-title',auth,generateBlogTitle);
aiRoutes.post('/generate-image',auth,generateImage);

export default aiRoutes;

