import { QueueClient } from "./components/client"
import { QueueColumn } from "./components/columns"
import { QueueController } from "./components/queue-controller"
import { SignOut } from "@/components/sign-out"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db/db"
import { format } from "date-fns"
import Link from "next/link"
import { translate } from "../../../../utils/translations"


const QueuesPage = async () => {


  const session = await auth()
  if (!session) redirect("/sign-in")



  const queues = await db.queue.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })


  const formattedQueues: QueueColumn[] = queues.map((queue) => ({
    id: queue.id,
    number: queue.number,
    userId: queue.userId,
    status: queue.status,
    username: queue.username,
    createdAt: format(queue.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col space-y-8">


      <div>
      
        <SignOut />
      </div>

      <QueueController queues={formattedQueues} />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <QueueClient data={formattedQueues} />
      </div>
    </div>
  )

}


export default QueuesPage