import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/Models/user";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(AuthOptions)

    const user: User = session?.user as User

    if (!session || session.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },

            { status: 401 }

        )
    }

    const userId = user._id
    const { acceptMessage } = await request.json()


    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessage },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "fail to update user"
                },

                { status: 401 }

            )
        }

        return Response.json(
            {
                success: true,
                message: "message acceptance status update",
                updatedUser
            },

            { status: 200 }

        )

    } catch (error) {

        console.log("fail to update user");
        return Response.json(
            {
                success: false,
                message: "fail to update user"
            },

            { status: 500 }

        )


    }

}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(AuthOptions)

    const user: User = session?.user as User

    if (!session || session.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },

            { status: 401 }

        )
    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId)




        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "user not found "
                },

                { status: 404 }

            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },

            { status: 200 }

        )
    }

    catch (error) {
        console.log("fail to update user");
        return Response.json(
            {
                success: false,
                message: "Error in geting message accepting message "
            },

            { status: 500 }

        )


    }


}
