import type {NextFunction, Request, Response} from "express";
import { env } from  "../config/env.js";
import { success } from "zod";

export function notFound(req:Request , res: Response):  void {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,

    });
}

export function errorHandler(
    err:unknown,
    _req:Request,
    res: Response,
    _next: NextFunction,
):void{
  if(err instanceof SyntaxError && "status" in err && err.status===400){
    res.status(400).json({success:false,message:"Invalid JSON in request body"});
    return;
  }  

  if(env.NODE_ENV!=="test"){
    console.error("Unhandled error:", err);
  }
  res.status(500).json({success:false,message:"Something went on the server"});
  
}