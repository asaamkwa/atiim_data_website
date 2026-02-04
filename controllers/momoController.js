import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Helper: read MoMo config at runtime
const getMomoConfig = () => {
  const subscriptionKey = process.env.MOMO_SUBSCRIPTION_KEY.trim();
  const apiUserId = process.env.MOMO_API_USER_ID.trim();
  const apiKey = process.env.MOMO_API_KEY.trim();

  // Safety check
  if (!subscriptionKey || !apiUserId || !apiKey) {
    throw new Error("MoMo credentials missing in .env file");
  }

  return {
    subscriptionKey,
    apiUserId,
    apiKey,
    tokenUrl: "https://sandbox.momodeveloper.mtn.com/collection/token/",
    paymentBaseUrl: "https://sandbox.momodeveloper.mtn.com/collection/v1_0",
  };
};

// Helper: normalize phone number to 233XXXXXXXXX
const normalizePhone = (number) => {
  if (number.startsWith("0")) return "233" + number.slice(1);
  if (number.startsWith("+")) return number.slice(1);
  return number;
};

// Get Access Token from MoMo API
async function getAccessToken() {
  const momoConfig = getMomoConfig();

  console.log("Generating Access Token...");
  console.log("API USER:", momoConfig.apiUserId);
  console.log("API KEY:", momoConfig.apiKey);
  console.log("SUB KEY:", momoConfig.subscriptionKey);

  const credentials = `${momoConfig.apiUserId}:${momoConfig.apiKey}`;
  console.log("Credentials string:", credentials);
  const base64Token = Buffer.from(credentials).toString("base64");
  console.log("Base64 Token:", base64Token);

  const response = await axios.post(
    momoConfig.tokenUrl,
    null,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
        Authorization: `Basic ${base64Token}`,
      },
    }
  );

  return response.data.access_token;
}

// Initiate MoMo Payment
export const initiateMomoPayment = async (req, res) => {
  try {
    const momoConfig = getMomoConfig();

    const { amount, currency, payerNumber, payerMessage } = req.body;
     // ✅ Safety check: make sure required fields exist
    if (!amount || !payerNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount or payerNumber",
      });
    }

    const token = await getAccessToken();
    const referenceId = uuidv4();
    

    const body = {
      amount: amount.toString(),
      currency: currency || "EUR",
      externalId: uuidv4(),
      payer: {
        partyIdType: "MSISDN",
        partyId: normalizePhone(payerNumber),
      },
      payerMessage: payerMessage || "Payment",
      payeeNote: "Atiim Data Bundle",
    };

    await axios.post(
      `${momoConfig.paymentBaseUrl}/requesttopay`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      referenceId,
      message: "Payment initiated. Awaiting user confirmation. Check your phone.",
    });

  } catch (error) {
    console.error("MoMo payment error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to initiate MoMo payment",
    });
  }
};

// Check Payment Status
export const checkPaymentStatus = async (req, res) => {
  try {
    const momoConfig = getMomoConfig();
    const { referenceId } = req.params;
    const token = await getAccessToken();

    const response = await axios.get(
      `${momoConfig.paymentBaseUrl}/requesttopay/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
        },
      }
    );

    res.json({
      success: true,
      status: response.data.status,
      data: response.data,
    });

  } catch (error) {
    console.error("Status check error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Status check failed" });
  }
};
