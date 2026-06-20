import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  name: string;
  logoUrl: string;
  cloudinaryPublicId: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      unique: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
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

// Indexing for sorting order and name
ClientSchema.index({ order: 1, name: 1 });

const Client = mongoose.model<IClient>('Client', ClientSchema);

export default Client;
