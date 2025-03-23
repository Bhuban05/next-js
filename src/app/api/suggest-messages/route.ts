import OpenAI from "openai";
import { NextResponse } from "next/server";


export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.";

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct", 
      prompt, 
      max_tokens: 400,
      stream: true, 
    });

    return NextResponse.json(response);
  } catch (error) {
    if(error instanceof OpenAI.APIError){
        const {name,status, headers,message}  = error
        return NextResponse.json({
            name,status,headers, message
        }, {status})

    }else{
        console.error("An unexpected error occured", error);
        throw error 
        
    }

  }
}