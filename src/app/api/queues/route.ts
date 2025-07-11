import { NextResponse } from "next/server";
import db from "@/lib/db/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { username, number } = body;

    // Check for existing number instead of username
    const existingQueue = await db.queue.findUnique({
      where: {
        number: number
      }
    });

    if (existingQueue) {
      return new NextResponse("Queue number already exists", { status: 400 });
    }

    const queue = await db.queue.create({
      data: {
        username: username || null,
        number,
        userId: session.user.id,
        status: "waiting"
      }
    });

    return NextResponse.json(queue);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  const queues = await db.queue.findMany({
    orderBy: {
      number: 'asc'
    }
  });
  return NextResponse.json(queues);
}



export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const queueId = url.searchParams.get('queueId');
  
  if (!queueId) {
    return NextResponse.json({ error: "Queue ID is required" }, { status: 400 });
  }

  // Delete the queue and associated session
  await db.$transaction([
    db.queueSession.deleteMany({
      where: {
        queueId: parseInt(queueId)
      }
    }),
    db.queue.delete({
      where: {
        id: parseInt(queueId)
      }
    })
  ]);

  // Clear the session cookie
  const response = NextResponse.json({ message: "Queue deleted successfully" });
  response.cookies.delete('queue-session');
  response.cookies.delete('queue_session');

  return response;
}


export async function PATCH(
  req: Request,
  { params }: { params: { queueId: string } }
) {
  try {
    const body = await req.json()
    const queue = await db.queue.update({
      where: {
        id: parseInt(params.queueId)
      },
      data: {
        number: body.number,
        username: body.username
      }
    })
    return NextResponse.json(queue)
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}


/*
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const queueId = url.searchParams.get('queueId');
  
  if (!queueId) {
    return NextResponse.json({ error: "Queue ID is required" }, { status: 400 });
  }

  const queue = await db.queue.delete({
    where: {
      id: parseInt(queueId)
    }
  });
  
  return NextResponse.json(queue);
}
*/