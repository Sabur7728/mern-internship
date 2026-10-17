const mongoose = require("mongoose");

const connectDB = async (uri) => {
  if (!uri) throw new Error("MONGODB_URI is not defined");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;
