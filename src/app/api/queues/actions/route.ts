import db from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { queueId, action, number, username, status } = body;

    // Handle queue actions (skip, serve, unskip)
    if (action) {
      switch (action) {
        case 'skip':
          const skippedQueue = await db.queue.update({
            where: { id: parseInt(queueId) },
            data: { status: "skipped" }
          });
          return NextResponse.json(skippedQueue);

        case 'served':
          await db.queue.update({
            where: { id: parseInt(queueId) },
            data: { status: "served" }
          });
          
          const nextPatient = await db.queue.findFirst({
            where: {
              status: "waiting",
              NOT: { id: parseInt(queueId) }
            },
            orderBy: { number: 'asc' }
          });
          return NextResponse.json(nextPatient);

        case 'unskip':
          const unskippedQueue = await db.queue.update({
            where: { id: parseInt(queueId) },
            data: { status: "waiting" }
          });
          return NextResponse.json(unskippedQueue);
      }
    }

    // Handle queue updates (number, username, status)
    if (number || username || status) {
      const queue = await db.queue.update({
        where: { id: parseInt(queueId) },
        data: {
          ...(number && { number }),
          ...(username && { username }),
          ...(status && { status })
        }
      });
      return NextResponse.json(queue);
    }

    return new NextResponse("Invalid request", { status: 400 });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
