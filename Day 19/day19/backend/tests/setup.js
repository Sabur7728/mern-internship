process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
jest.setTimeout(60000);

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterEach(async () => {
  for (const c of Object.values(mongoose.connection.collections)) await c.deleteMany({});
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
