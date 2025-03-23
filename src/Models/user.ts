import mongoose ,  {Schema, Document}  from  "mongoose";


export interface Message extends Document{
    Content:string;
    createAt: Date;
}

const MessageSchema:Schema<Message> = new Schema({

    Content: {
        type: String,
        required: true

    },
    createAt:{
        type:Date,
        required: true,


        
        default: Date.now
    }


})

export interface User extends Document{
    username:string;
    email:string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isverified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
    

}

const UserSchema:Schema<User> = new Schema({

    username: {
        type: String,
        required: [true, "username is required"],
        trim: true

    },
    email:{
        type: String,
        required: [true, "username is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'please us a valid email  address']
    },

    password:{
        type: String,
        required: [true, "password is required"],

    },
    verifyCode:{
        type: String,
        required: [true, "verify code  is required"],

    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "verify code  expiry  is required"],

    },
    isverified:{
        type: Boolean,
        required: [true, "verify code expiry is required"],
        
    },

    isAcceptingMessage:{
        type: Boolean,
        defaul:true,

    },
    messages:[MessageSchema]



})

const UserModel = (mongoose.models.User as mongoose.Model<User>)  || mongoose.model<User>("User", UserSchema)


export default UserModel;