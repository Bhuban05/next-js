import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/Models/user";
import dbConnect from "@/lib/dbConnect";
import {User}  from "next-auth"
import mongoose from "mongoose";

export async  function GET(request: Request){
    await dbConnect()
     const session = await getServerSession( AuthOptions)
    
        const user: User = session?.user  as User
    
        if(!session||  session.user  ){
            return Response.json(
                {
                    success: false,
                    message: "not authenticated"
                },
        
                {status: 401}
        
            )
        }
    
        const userId = new mongoose.Types.ObjectId(user._id);

        try {

            const user = await UserModel.aggregate([
                {$match:{id:userId}},
                {$unwind: '$messages'},
                {$sort: {'messages.createAt': -1}},
                {$group:{_id: '$_id', messages:{$push:'messages'}}}

            ])

            if(!user  || user.length  ===0){
                return Response.json(
                    {
                        success: false,
                        message: "user not found"
                    },
            
                    {status: 401}
            
                )
            }
                return Response.json(
                    {
                        success: true,
                        messages: user[0].messages
                    },
            
                    {status: 200}
                )
            
        } catch (error) {
            console.log("Än Unexpexted Erroroccured");
            
            
    return Response.json(
        
        {
            
            success: false,
            message: "Not Authenticated"
        },

        {status: 500}    
    )
            
        }

        }