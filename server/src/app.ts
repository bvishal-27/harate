import express,{ type Express} from "express";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler ,notFound} from "./middleware/errorHandler.js";

export const app: Express = express();


app.disable("x-powered-by");

app.use(express.json({limit:"10kb"}));

app.get("/api/health", (_req,res)=>{
    res.status(200).json({
        status:"ok",
        app:"Harate",
        tagline:"Your World, Your Conversations, Talk freely,connect privately.",
        uptimeSecond:Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
    });

});

app.use("/api/auth",authRoutes);


app.use(notFound);
app.use(errorHandler);