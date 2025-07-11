// pages/api/queue/check-session.js
import { NextResponse } from "next/server"
import db from "@/lib/db/db"
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('queue-session')?.value

    if (!sessionToken) {
      return NextResponse.json({ queueId: null }, { status: 200 })
    }

    // Find the active queue session
    const queueSession = await db.queueSession.findUnique({
      where: { sessionToken },
      include: { queue: true },
    })

    if (!queueSession || queueSession.queue.status !== 'waiting') {
      return NextResponse.json({ queueId: null }, { status: 200 })
    }

    // Return the queue ID
    return NextResponse.json({ queueId: queueSession.queue.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check queue session" },
      { status: 500 }
    )
  }
}