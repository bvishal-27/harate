import type {HydratedDocument } from "mongoose";
import type {IUser} from "../models/User.js";
import type {PublicUser} from "../types/auth.js";

export function toPublicUser(user:HydratedDocument<IUser>):PublicUser{
    return{
        id:user.id.toString(),
        username:user.username,
        email:user.email,
        avatarUrl:user.avatarUrl,
        createdAt:user.createdAt,
    };
}