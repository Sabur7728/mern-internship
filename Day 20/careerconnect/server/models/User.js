import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is invalid'],
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate', index: true },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => { delete ret.passwordHash; delete ret.__v; return ret; },
});

export default mongoose.model('User', userSchema);
