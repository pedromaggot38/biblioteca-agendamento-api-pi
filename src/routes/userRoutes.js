import express from 'express';
import protect from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import * as userController from '../controllers/userController.js';
import { updateMeSchema } from '../models/userSchema.js';

const router = express.Router();

router
  .route('/me')
  .get(protect, userController.me)
  .patch(protect, validate(updateMeSchema), userController.updateMe);

export default router;