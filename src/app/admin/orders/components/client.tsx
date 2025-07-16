"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { QueueColumn, createColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import QueueForm from "../[queueId]/components/queue-form";
import { useLanguage } from "../../../../../context/LanguageContext";
import { translate } from "../../../../../utils/translations";
import { useQueue } from "@/app/QueueContext";
export const QueueClient: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { locale } = useLanguage();
  const { queues, clearAllQueues } = useQueue();

  const handleDeleteAll = async () => {
    try {
      await axios.delete("/api/queues/all");
      clearAllQueues(); // Update local state instead of reloading
      toast.success(translate(locale, "queueDeleted"));
    } catch (error) {
      toast.error(translate(locale, "failedToDeleteAllQueues"));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate(locale, "createNewQueue")}</DialogTitle>
          </DialogHeader>
          <QueueForm
            initialData={null}
            onSuccess={() => {
              setOpen(false);
              // No need to reload - state is updated in QueueForm
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <Heading
          title={`${translate(locale, "queueSystem")} (${queues.length})`}
          description={translate(locale, "manageQueueNumbers")}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setOpen(true)}
            className="bg-gray-600 hover:bg-gray-500"
          >
            <Plus className="h-2 w-2 " />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={queues.length === 0}>
                <Trash2 className="h-2 w-2 " />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{translate(locale, "deleteAllQueues")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {translate(locale, "deleteAllDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter
                className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} gap-2`}
              >
                <AlertDialogCancel>{translate(locale, "cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAll} className="bg-red-600  hover:bg-white hover:text-red-600">
                  {translate(locale, "deleteAll")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
      <DataTable columns={createColumns(locale)} data={queues} />
    </>
  );
};
