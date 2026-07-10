const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, default: 'Generic' },
    image: { type: String, required: true },
    stock: { type: Number, default: 50 },
    rating: { type: Number, default: 4 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
