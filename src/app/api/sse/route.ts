// src/app/api/sse/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db/db';

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const getCurrentQueueNumber = async () => {
    const waitingQueues = await db.queue.findMany({
      where: { status: 'waiting' },
      orderBy: { number: 'asc' },
      take: 1,
    });
    return waitingQueues.length > 0 ? waitingQueues[0].number : 0;
  };

  const interval = setInterval(async () => {
    try {
      const currentQueueNumber = await getCurrentQueueNumber();
      await writer.write(
        new TextEncoder().encode(`data: ${JSON.stringify({ currentQueueNumber })}\n\n`)
      );
    } catch (error) {
      console.error('Error writing to stream:', error);
      clearInterval(interval);
      writer.close();
    }
  }, 1000);

  // Clean up when the client disconnects
  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}