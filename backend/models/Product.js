import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  isEcoFriendly: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 4 },
  reviews: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  features: { type: [String], default: [] },
  salePrice: { type: Number, default: 0 },
  isSale: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

export default model('Product', ProductSchema);

