import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1, createdAt: -1 });

const Lead = mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
