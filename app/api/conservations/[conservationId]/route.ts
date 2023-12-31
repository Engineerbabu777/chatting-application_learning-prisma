import getCurrentUser from "@/app/(site)/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDB";
import { pusherServer } from "@/app/libs/pusher";
// import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    conservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conservationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return NextResponse.json({
            message: 'Unauthorized',},{status:401})
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conservationId
      },
      include: {
        users: true
      }
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conservationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
      }
    })

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 