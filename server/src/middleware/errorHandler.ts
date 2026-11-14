import type {NextFunction, Request, Response} from "express";
import { env } from  "../config/env.js";
import{AppError} from "../utils/AppError.js";




export function notFound(req:Request , res: Response):  void {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,

    });
}

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === 11000;
}


export function errorHandler(
    err:unknown,
    _req:Request,
    res: Response,
    _next: NextFunction,
):void{
  // case 1:
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  if(err instanceof SyntaxError && "status" in err && err.status===400){
    res.status(400).json({success:false,message:"Invalid JSON in request body"});
    return;
  }  

  if(isDuplicateKeyError(err)){
    res.status(409).json({success: false, message: "That value is already in use" })
  return;
  }


  if(env.NODE_ENV!=="test"){
    console.error("Unhandled error:", err);
  }
  res.status(500).json({success:false,message:"Something went on the server"});
  
}