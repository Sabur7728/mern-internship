import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, match: [/^[0-9+\-\s()]{7,20}$/, 'Phone number is invalid'] },
    location: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experienceYears: { type: Number, min: 0, max: 60, default: 0 },
    education: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    summary: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

candidateSchema.index({ name: 'text', skills: 'text' });

export default mongoose.model('Candidate', candidateSchema);
