import { Router } from 'express';
import { payWithMoMo } from '../controllers/paymentController.js';

const router = Router();

router.post('/pay', payWithMoMo);

export default router;
