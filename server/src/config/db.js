import mongoose from "mongoose";

export async function connectDatabase() {
  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database connected: ${connection.connection.name}`);
}
