import { QueueClient } from "./components/client"
import { QueueController } from "./components/queue-controller"
import { SignOut } from "@/components/sign-out"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db/db"
import { format } from "date-fns"
import { QueueProvider } from '@/app/QueueContext'



const QueuesPage = async () => {
  const session = await auth()
  if (!session) redirect("/sign-in")

  const queues = await db.queue.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedQueues = queues.map((queue) => ({
    id: queue.id,
    number: queue.number,
    userId: queue.userId,
    status: queue.status,
    username: queue.username,
    createdAt: format(queue.createdAt, "MMMM do, yyyy")
  }))

  return (
    <QueueProvider initialQueues={formattedQueues}>
      <div className="flex-col space-y-8">
        <div>
          <SignOut />
        </div>
        <QueueController />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <QueueClient />
        </div>
      </div>
    </QueueProvider>
  )
}

export default QueuesPage
