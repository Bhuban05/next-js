
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendverificationEmail";


export async function POST(request: Request) {

    if(request.method ! == 'GET') {
        return Response.json({
            success: false,
            message: "method is allwowed ",

        },{status:405})
    }
    await dbConnect()


    try {

        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            isverified: true
        })


        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                messsage: 'Username is already taken'
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })


        const verifyCode = Math.floor(100000 + Math.random()
            * 900000).toString()

        if (existingUserByEmail) {
          if(existingUserByEmail.isverified) {
            return Response.json({

                success: false,
                message:  "User already exist with this email"

            },{status: 400})
            
          }else   {
            const hashPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hashPassword;
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
            await existingUserByEmail.save();
        }
        
    }else{
        const hashPassword = await bcrypt.hash(password, 10)
          const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
              const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isverified: false,
                isAcceptingMessage: true,
                messages: []
                     })

                     await newUser.save()
        }


        // send verifivation  email


    const emailResponse =   await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({

                success: false,
                message: emailResponse.message

            },  {status: 500})
            
        }


        return Response.json({

            success: true,
            message:  "user register successfully.please verify your email"

        },  {status: 201})
        


    } catch (error) {
        console.error('Error registering user', error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },

            {
                status: 500
            }
        )

    }
}