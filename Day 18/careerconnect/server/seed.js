import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Company from "./models/Company.js";

await mongoose.connect(process.env.MONGO_URI);
await User.deleteMany({ email: /@careerconnect\.test$/ });

const [admin] = await User.create([
  { name: "Admin User", email: "admin@careerconnect.test", password: "Admin@1234", role: "admin" },
  { name: "Recruiter A", email: "recruiterA@careerconnect.test", password: "Recruit@1234", role: "recruiter" },
  { name: "Recruiter B", email: "recruiterB@careerconnect.test", password: "Recruit@1234", role: "recruiter" },
  { name: "Candidate A", email: "candidateA@careerconnect.test", password: "Candid@1234", role: "candidate" },
  { name: "Candidate B", email: "candidateB@careerconnect.test", password: "Candid@1234", role: "candidate" },
]);

if (!(await Company.exists({ name: "TechNova" }))) {
  await Company.create({ name: "TechNova", location: "Pune", website: "https://technova.example", createdBy: admin._id });
}

console.log("Seeded. Accounts:");
console.log("admin@careerconnect.test      / Admin@1234");
console.log("recruiterA@careerconnect.test / Recruit@1234");
console.log("recruiterB@careerconnect.test / Recruit@1234");
console.log("candidateA@careerconnect.test / Candid@1234");
console.log("candidateB@careerconnect.test / Candid@1234");
await mongoose.disconnect();