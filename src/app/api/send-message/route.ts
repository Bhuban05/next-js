import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Models/user";

import { Message } from "@/Models/user";


export async function POST(request:Request){
    await dbConnect()

  const {username, content} =   await request.json()
  try {

 const user = await  UserModel.findOne({username})

 if (!user) {
    return Response.json(
        {
            success: false,
            message: "user not found"
        },

        {status: 404}    
    )
 }

 // is user accepting the messages 
 if (!user.isAcceptingMessage) {
    return Response.json(
        {
            success: false,
            message: "user is notb accepting the message "
        },

        {status: 401}    
    )
 }

 const newMessage = { content, createdAt: new Date() };
 user.messages.push(newMessage as unknown as Message);
 


 await user.save()

    return Response.json(
        {
            success: true,
            message: "message sent successfully"
        },

        {status: 404}    
    )
 


    
  } catch (error) {
    console.log("Error adding messages");
    

    return Response.json(
        {
            success: true,
            message: "internal server error "
        },

        {status: 500}    
    
    )

    
  }
}