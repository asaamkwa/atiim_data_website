// models/DataBundle.js
import mongoose from 'mongoose';

const DataBundleSchema = new mongoose.Schema({
  network: {
    type: String,
    enum: ['MTN', 'AIRTELTIGO', 'TELECEL'],
    required: true
  },

  name: {
    type: String, // "1GB", "5GB"
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model('DataBundle', DataBundleSchema);
