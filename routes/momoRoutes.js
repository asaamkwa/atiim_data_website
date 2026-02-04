import express from "express";
import { initiateMomoPayment, checkPaymentStatus } from "../controllers/momoController.js";

const router = express.Router();

// Initiate payment
router.post("/pay", initiateMomoPayment);

// Check payment status
router.get("/momo/pay/status/:referenceId", checkPaymentStatus);


export default router;
