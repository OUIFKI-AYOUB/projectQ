import QueueForm from "@/app/queue/[id]/components/queue-form";
import db from "@/lib/db/db";
interface PageProps {
  params: {
    queueId: string;  // Also fixed - params is not a Promise
  };
}

const QueuePage = async ({ params }: PageProps) => {
  const queue = await db.queue.findUnique({
    where: {
      id: parseInt(params.queueId),
    },
  });

  if (!queue) {
    return <div>Queue not found</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <QueueForm initialData={queue} />
      </div>
    </div>
  );
};

export default QueuePage;