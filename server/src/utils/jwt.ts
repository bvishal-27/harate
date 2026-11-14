import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
const SECONDS_PER_DAY= 60*60*24;

export function signToken(userId: string): string{
    return jwt.sign({}, env.JWT_SECRET, {
        subject:userId,
        algorithm:"HS256",
        expiresIn:env.JWT_EXPIRES_IN_DAYS * SECONDS_PER_DAY,


    });
}

export function verifyToken(token:string):string{
    const decoded = jwt.verify(token, env.JWT_SECRET,{ algorithms: ["HS256"] });
if(typeof decoded ==="string" || !decoded.sub){
    throw new Error("Invalid token payload");
}
return decoded.sub;
}