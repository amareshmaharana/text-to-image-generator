import express from 'express';

import { generateImage } from '../controllers/image.controller.js';
import { userAuth } from '../middlewares/auth.middleware.js';

const imageRouter = express.Router();

imageRouter.post('/generate-img', userAuth, generateImage);

export default imageRouter;