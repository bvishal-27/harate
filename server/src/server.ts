import "dotenv/config";

import http from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB,disconnectDB } from "./config/db.js";



async function startServer():Promise<void>{
    await connectDB();

    const httpServer = http.createServer(app);

    httpServer.listen(env.PORT,()=>{
        console.log(`🚀 Harate server running at http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
  const shutdown =(signal:string): void=>{
    console.log(`\n${signal} received. Shutting down...`);
    httpServer.close(async()=>{
        await disconnectDB();
        process.exit(0);
    });
  };
  process.on("SIGINT",()=> shutdown("SIGINT"));
  process.on("SIGTERM",()=> shutdown("SIGTERM"));
}
startServer().catch((error:unknown)=>{
    console.error("❌ Failed to start server:", error);
  process.exit(1);
});