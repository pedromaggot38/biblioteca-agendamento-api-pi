import express from 'express';
import protect from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import * as userController from '../controllers/userController.js';
import { updateMeSchema, updatePasswordSchema } from '../models/userSchema.js';

const router = express.Router();

router
  .route('/me')
  .get(protect, userController.me)
  .patch(protect, validate(updateMeSchema), userController.updateMe);

router
  .route('/me/password')
  .patch(protect, validate(updatePasswordSchema), userController.updatePassword);

router.post('/me/request-verification', protect, userController.solicitarNovoTokenVerificacao);

router.post('/me/verify-code', protect, userController.verificarTokenVerificacao);

export default router;