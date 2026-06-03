import mongoose, { Document, Schema } from 'mongoose';

export interface ICertification extends Document {
  title: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  issuer: string;
  year: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    issuer: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Certification = mongoose.model<ICertification>(
  'Certification',
  CertificationSchema
);

export default Certification;
