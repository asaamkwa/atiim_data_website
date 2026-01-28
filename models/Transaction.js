import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  network: String,
  phone: String,
  amount: Number,
  status: { type: String, default: 'PENDING' },
  referenceId: String
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
