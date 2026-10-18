import mongoose from 'mongoose';

export const APPLICATION_STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Selected'];

const applicationSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: 'Applied' },
    recruiterNotes: { type: String, trim: true, maxlength: 2000, default: '' },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// a candidate can only apply once to a job
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
