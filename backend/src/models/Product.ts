import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      // Covered by compound index { category, isActive } below
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for category + active filtering
ProductSchema.index({ category: 1, isActive: 1 });

// Full-text search index
ProductSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
