import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  createdBy: mongoose.Types.ObjectId;
}

const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
