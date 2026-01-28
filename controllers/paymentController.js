import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';

export const payWithMoMo = async (req, res) => {
  try {
    const { phone, amount, network } = req.body;

    const transaction = await Transaction.create({
      phone,
      amount,
      network,
      referenceId: uuidv4(),
      status: 'PENDING'
    });

    res.json({
      success: true,
      message: 'Payment initiated',
      transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
