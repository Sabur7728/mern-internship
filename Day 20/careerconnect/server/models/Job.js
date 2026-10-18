import mongoose from 'mongoose';

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], trim: true, minlength: 10, maxlength: 5000 },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    location: { type: String, required: [true, 'Location is required'], trim: true, maxlength: 100 },
    employmentType: { type: String, enum: EMPLOYMENT_TYPES, default: 'Full-time' },
    experienceMin: { type: Number, min: 0, max: 50, default: 0 },
    salaryMin: { type: Number, min: 0, default: 0 },
    salaryMax: {
      type: Number, min: 0, default: 0,
      validate: {
        validator(v) { return v >= (this.salaryMin || 0); },
        message: 'salaryMax must be greater than or equal to salaryMin',
      },
    },
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open', index: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ createdAt: -1 });

export default mongoose.model('Job', jobSchema);
