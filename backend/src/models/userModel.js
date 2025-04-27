import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['customer','seller','admin'], default: 'customer' },
  isApproved: { type: Boolean, default: true },
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  }
  
}, { timestamps: true });

export default model('User', userSchema);
