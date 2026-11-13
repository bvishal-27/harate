import mongoose from "mongoose";
import { env } from "./env.js"

export async function connectDB( ): Promise<void> {
    await mongoose.connect(env.MONGO_URI,{serverSelectionTimeoutMS:10_000});

  console.log(`✅ MongoDB connected. Database: ${mongoose.connection.name}`);
    
}
export async function  disconnectDB():Promise<void>{
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    
}