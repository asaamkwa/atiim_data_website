import { Router } from 'express';
import { homePage, buyPage } from '../controllers/pageController.js';

const router = Router();

router.get('/', homePage);
router.get('/buy', buyPage);

export default router;
