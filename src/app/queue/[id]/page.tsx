// src/app/queue/[id]/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import QueueStatus from '@/components/QueueStatus';
import db from "@/lib/db/db";

async function getQueueData(id: string) {
  const queue = await db.queue.findUnique({
    where: { id: parseInt(id) }
  });

  const waitingQueues = await db.queue.findMany({
    where: { status: 'waiting' },
    orderBy: { number: 'asc' }
  });

  return { queue, waitingQueues };
}

export default async function QueuePage({ params }: { params: { id: string } }) {
  // Ensure params.id is properly awaited
  const { queue, waitingQueues } = await getQueueData(params.id);

  if (!queue) {
    return <div>Queue not found</div>;
  }

  // Get the current queue number (lowest number in waiting status)
  const currentQueue = waitingQueues[0];
  const currentQueueNumber = currentQueue ? currentQueue.number : 0;

  return (
    <div>
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardContent>
            <QueueStatus
              queueNumber={queue.number}
              username={queue.username}
              currentQueueNumber={currentQueueNumber}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}