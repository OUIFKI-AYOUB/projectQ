import { NextResponse } from "next/server";
import db from "@/lib/db/db";

export async function GET() {
  await db.queueSession.deleteMany({
    where: {
      AND: {
        queueId: {
          notIn: (await db.queue.findMany()).map(queue => queue.id)
        }
      }
    }
  });

  return NextResponse.json({ success: true });
}
