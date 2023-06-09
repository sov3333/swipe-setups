import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: { type: String }, // can be removed
    img: { type: String },
    type: { type: String },
    brand: { type: String },
    model: { type: String },
    title: { type: String },
    description: { type: String },
    features: [{ name: { type: String } }],
    specifications: [
      {
        name: { type: String },
        stat: { type: String },
      },
    ],
    ratings: [
      {
        user: { type: String },
        rating: { type: Number },
        review: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
