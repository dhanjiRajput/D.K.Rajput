import express from 'express';
import { auth } from '../Middleware/auth.js';
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from '../controllers/aiController.js';
import { upload } from '../config/multer.js';

const aiRoutes=express.Router();

aiRoutes.post('/generate-article',auth,generateArticle);
aiRoutes.post('/generate-blog-title',auth,generateBlogTitle);
aiRoutes.post('/generate-image',auth,generateImage);
aiRoutes.post('/remove-image-background',upload.single('image'),auth,removeImageBackground);
aiRoutes.post('/remove-image-object',upload.single('image'),auth,removeImageObject);
aiRoutes.post('/resume-review',upload.single('resume'),auth,resumeReview);

export default aiRoutes;