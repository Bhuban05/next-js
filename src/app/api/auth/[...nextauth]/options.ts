import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Models/user";


export const  AuthOptions: NextAuthOptions  = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any> {
             await dbConnect()

            try {

           const User =   await  UserModel.findOne({
            $or:[

                {email:credentials.identifier},
             
                {username:credentials.identifier},
                
           
            ]

        })

        if(!User){
            throw new Error('No user founed with his email')
        }

        if(User.isverified){
            throw new Error('please verify account first')
        }

      const isPasswordCorrect = await bcrypt.compare(credentials.password, User.password)
      if(isPasswordCorrect){
        return  User
      }  
      else{
        throw new Error('Incorrect password')
      }


    } catch (err: any) {
        throw  new Error(err)
        
                   }

               }

          })
    ],
    callbacks:{
        async jwt({ token, user}) {
            if(user){
                
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username= user.username
            }
            return token
          },
      
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
                
            }
            return session
          },
       
    },

    pages: {
        signIn: '/sign-in'

    },

    session:{
        strategy: "jwt"
    
    },
    secret: process.env.NEXTAUTH_SECRET,
}
