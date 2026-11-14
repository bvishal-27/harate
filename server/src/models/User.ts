import { Schema, model } from  "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
const userSchema = new Schema<IUser>(
    {
       username: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:30,


       } ,
       email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
       },
       password:{
        type:String,
        required:true,
        select:false,
       },
      


    avatarUrl:{ type:String, default: ""},
},
{ timestamps:true},
);
export const User = model<IUser> ("User",userSchema);