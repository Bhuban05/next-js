import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Models/user";


export async  function POST(request: Request){
 await  dbConnect()

 try {

 const{username, code}  =     await request.json()

 const decodeUsername =  decodeURIComponent(username)
 const user =  await  UserModel.findOne({
    username:decodeUsername
 })

 if(!user){
    return Response.json(
        {
            success: false,
            message: "Error veryfing user"
        },

        {status: 500}

    )
 }

 const isCodeValid = user.verifyCode === code
 const isCodeNotExpired = new Date(user.verifyCodeExpiry)  >  new Date()

 if (isCodeValid && isCodeNotExpired) {

    user.isverified  = true
    await user.save()

    return Response.json(
        {
            success: true,
            message: "Account verified successfully"
        },

        {status: 200}

    )
    
 }  else  if (!isCodeNotExpired){
    return Response.json(
        {
            success: false,
            message: "verification code has expired please sig up again"
        },

        {status: 400}

    )


 }else{
    return Response.json(
        {
            success: true,
            message: "incorrect verification code "
        },

        {status: 400}

    )

 }
    
 } catch (error) {
    console.error("Errror checking username", error);
    return Response.json(
        {
            success: false,
            message: "Error veryfing user"
        },

        {status: 500}

    )
    
    
 }
}