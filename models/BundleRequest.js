// models/BundleRequest.js
import mongoose from 'mongoose';

const BundleRequestSchema = new mongoose.Schema({
  network: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String,
    required: true
  },

  bundle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataBundle',
    required: true
  },

  price: {
    type: Number,
    required: true
  }

}, { timestamps: true });

export default mongoose.model('BundleRequest', BundleRequestSchema);
