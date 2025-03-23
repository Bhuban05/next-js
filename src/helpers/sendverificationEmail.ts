import { resend } from "@/lib/Resend";

import VerificationEmail from "../../email/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";
import { promises } from "dns";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string

): Promise<ApiResponse>{

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'verification code',
            react: VerificationEmail({ username, otp: verifyCode}),
    });
        return{success: false, message:'verification email sucessfully'}
        
    } catch (emailError) {
        
        console.log('Ërror sending verfication email');
        return{success: false, message:'failed to send verification email'}
    }
 

}

