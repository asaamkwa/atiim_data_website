import { Router } from 'express';
import { homePage, buyPage, aboutPage } from '../controllers/pageController.js';

const router = Router();

router.get('/', homePage);
router.get('/buy', buyPage);
router.get('/about', aboutPage);

export default router;
