import { Router } from 'express';
import {
  loginPage,
  loginUser,
  registerPage,
  registerUser
} from '../controllers/authController.js';

const router = Router();

router.get('/login', loginPage);
router.post('/login', loginUser);

router.get('/register', registerPage);
router.post('/register', registerUser);

export default router;
