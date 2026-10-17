require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD");
  await User.deleteOne({ email });
  await User.create({ name: "Admin", email, password, role: "admin" });
  console.log("Admin created:", email);
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
