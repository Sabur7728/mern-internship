import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Company from './models/Company.js';
import Job from './models/Job.js';
import Candidate from './models/Candidate.js';
import Application from './models/Application.js';

const password = process.env.SEED_PASSWORD || 'Password@123';

await connectDB();
await Promise.all([User, Company, Job, Candidate, Application].map((m) => m.deleteMany({})));
await Promise.all([User, Company, Job, Candidate, Application].map((m) => m.syncIndexes()));

const passwordHash = await bcrypt.hash(password, 10);
const [admin, rec1, rec2, can1, can2] = await User.create([
  { name: 'Admin User', email: 'admin@careerconnect.com', passwordHash, role: 'admin' },
  { name: 'Riya Recruiter', email: 'recruiter1@careerconnect.com', passwordHash, role: 'recruiter' },
  { name: 'Rahul Recruiter', email: 'recruiter2@careerconnect.com', passwordHash, role: 'recruiter' },
  { name: 'Aman Candidate', email: 'candidate1@careerconnect.com', passwordHash, role: 'candidate' },
  { name: 'Sara Candidate', email: 'candidate2@careerconnect.com', passwordHash, role: 'candidate' },
]);

const [cand1, cand2] = await Candidate.create([
  { user: can1._id, name: can1.name, email: can1.email, phone: '9876543210', location: 'Pune', skills: ['React', 'Node.js', 'MongoDB'], experienceYears: 1, education: 'B.E. Computer Science', summary: 'Junior MERN developer.' },
  { user: can2._id, name: can2.name, email: can2.email, phone: '9123456780', location: 'Bangalore', skills: ['JavaScript', 'CSS', 'React'], experienceYears: 2, education: 'B.Sc. IT', summary: 'Frontend focused developer.' },
]);

const [c1, c2, c3] = await Company.create([
  { name: 'TechNova', industry: 'Software', location: 'Bangalore', website: 'https://technova.example.com', description: 'Product engineering company.', createdBy: rec1._id },
  { name: 'DataWorks', industry: 'Analytics', location: 'Pune', website: 'https://dataworks.example.com', description: 'Data and AI consulting.', createdBy: rec2._id },
  { name: 'CloudSpring', industry: 'Cloud', location: 'Hyderabad', website: 'https://cloudspring.example.com', description: 'Cloud solutions provider.', createdBy: rec1._id },
]);

const base = (o) => ({ description: 'Join our team and build scalable products with modern technology and a supportive team.', ...o });
const jobs = await Job.create([
  base({ title: 'React Developer', company: c1._id, recruiter: rec1._id, location: 'Bangalore', employmentType: 'Full-time', experienceMin: 1, salaryMin: 600000, salaryMax: 1200000, skills: ['React', 'JavaScript', 'CSS'] }),
  base({ title: 'Node.js Backend Engineer', company: c1._id, recruiter: rec1._id, location: 'Bangalore', employmentType: 'Full-time', experienceMin: 2, salaryMin: 800000, salaryMax: 1500000, skills: ['Node.js', 'Express', 'MongoDB'] }),
  base({ title: 'MERN Stack Intern', company: c1._id, recruiter: rec1._id, location: 'Remote', employmentType: 'Internship', experienceMin: 0, salaryMin: 120000, salaryMax: 240000, skills: ['React', 'Node.js', 'MongoDB'] }),
  base({ title: 'Full Stack Developer', company: c3._id, recruiter: rec1._id, location: 'Hyderabad', employmentType: 'Full-time', experienceMin: 3, salaryMin: 1200000, salaryMax: 2000000, skills: ['React', 'Node.js', 'AWS'] }),
  base({ title: 'Data Analyst', company: c2._id, recruiter: rec2._id, location: 'Pune', employmentType: 'Full-time', experienceMin: 1, salaryMin: 500000, salaryMax: 900000, skills: ['SQL', 'Python', 'Excel'] }),
  base({ title: 'Frontend Contractor', company: c2._id, recruiter: rec2._id, location: 'Pune', employmentType: 'Contract', experienceMin: 2, salaryMin: 700000, salaryMax: 1100000, skills: ['React', 'TypeScript'] }),
  base({ title: 'DevOps Engineer', company: c3._id, recruiter: rec2._id, location: 'Hyderabad', employmentType: 'Full-time', experienceMin: 3, salaryMin: 1300000, salaryMax: 2200000, skills: ['Docker', 'Kubernetes', 'AWS'] }),
  base({ title: 'UI Designer', company: c2._id, recruiter: rec2._id, location: 'Remote', employmentType: 'Part-time', experienceMin: 1, salaryMin: 300000, salaryMax: 600000, skills: ['Figma', 'CSS'] }),
  base({ title: 'Senior Java Developer (Closed)', company: c3._id, recruiter: rec1._id, location: 'Mumbai', employmentType: 'Full-time', experienceMin: 5, salaryMin: 1800000, salaryMax: 2800000, skills: ['Java', 'Spring'], status: 'Closed' }),
]);

await Application.create([
  { candidate: cand1._id, job: jobs[0]._id, status: 'Under Review', recruiterNotes: 'Good React portfolio.' },
  { candidate: cand1._id, job: jobs[2]._id, status: 'Shortlisted' },
  { candidate: cand2._id, job: jobs[0]._id, status: 'Interview' },
  { candidate: cand2._id, job: jobs[4]._id, status: 'Applied' },
]);

console.log('Seed complete. Demo logins (password from SEED_PASSWORD or default):');
console.log(' admin@careerconnect.com | recruiter1@careerconnect.com | recruiter2@careerconnect.com | candidate1@careerconnect.com | candidate2@careerconnect.com');
await mongoose.disconnect();
