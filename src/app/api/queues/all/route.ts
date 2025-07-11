import { NextResponse } from "next/server";

import db from "@/lib/db/db";
/*
export async function DELETE() {
  try {
    await db.queue.deleteMany({});
    return NextResponse.json({ message: "All queues deleted successfully" });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
*/
export async function DELETE() {
  try {
    // Clear browser cookies first
    const response = NextResponse.json({ message: "All queues and sessions deleted successfully" });
    response.cookies.delete('queue-session');
    response.cookies.delete('queue_session');

    // Then delete from database
    await db.$transaction([
      db.queueSession.deleteMany({}),
      db.queue.deleteMany({})
    ]);

    return response;
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
