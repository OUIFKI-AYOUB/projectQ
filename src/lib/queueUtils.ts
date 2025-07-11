// lib/queueUtils.ts
import db from "@/lib/db/db";

export async function getCurrentQueueNumber(): Promise<number> {
  const waitingQueues = await db.queue.findMany({
    where: { status: 'waiting' },
    orderBy: { number: 'asc' },
    take: 1,
  });

  return waitingQueues.length > 0 ? waitingQueues[0].number : 0;
}