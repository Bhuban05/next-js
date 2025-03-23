import { Message } from "@/Models/user";

export interface  ApiResponse{
    // success: any;
    success: boolean;
    message: string;
    isAccesptingMessage?: boolean
    messages?: Array<Message>
}