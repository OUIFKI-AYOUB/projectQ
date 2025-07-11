import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import QueueForm from "../[queueId]/components/queue-form";
import { translate } from "../../../../../utils/translations";
import { useLanguage } from "../../../../../context/LanguageContext";

export type QueueColumn = {
  id: number;
  number: number;
  userId: string;
  status: string;
  username: string | null;
  createdAt: string;
};

export const createColumns = (locale: string): ColumnDef<QueueColumn>[] => [
  {
    accessorKey: "number",
    header: () => (
      <div style={{ textAlign: locale === "ar" ? "right" : "left" }}>
        {translate(locale, "queueNumber")}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: () => (
      <div style={{ textAlign: locale === "ar" ? "right" : "left" }}>
        {translate(locale, "username")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div style={{ textAlign: locale === "ar" ? "right" : "left" }}>
        {translate(locale, "status")}
      </div>
    ),
    cell: ({ row }) => (
      <div
        className={`
          ${row.original.status === "waiting" && "text-yellow-600"}
          ${row.original.status === "served" && "text-green-600"}
          ${row.original.status === "skipped" && "text-red-600"}
        `}
        style={{ textAlign: locale === "ar" ? "right" : "left" }}
      >
        {translate(locale, row.original.status)}
      </div>
    ),
  },

  {
    id: "actions",
    header: () => (
      <div style={{ textAlign: locale === "ar" ? "right" : "left" }}>
        {translate(locale, "actions")}
      </div>
    ),
    cell: ({ row }) => {
      const queue = row.original;
      const [open, setOpen] = useState(false); // State for edit dialog
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
      const { locale } = useLanguage();

      const handleSkip = async () => {
        try {
          await axios.patch("/api/queues/actions", {
            queueId: queue.id,
            action: "skip",
          });
          toast.success(translate(locale, "queueSkipped"));
          window.location.reload();
        } catch (error) {
          toast.error(translate(locale, "failedToSkipQueue"));
        }
      };

      const handleUnskip = async () => {
        try {
          await axios.patch("/api/queues/actions", {
            queueId: queue.id,
            action: "unskip",
          });
          toast.success(translate(locale, "queueUnskipped"));
          window.location.reload();
        } catch (error) {
          toast.error(translate(locale, "failedToUnskipQueue"));
        }
      };

      const handleDelete = async () => {
        try {
          await axios.delete("/api/queues", {
            params: { queueId: queue.id },
          });
          toast.success(translate(locale, "queueDeleted"));
          window.location.reload();
        } catch (error) {
          toast.error(translate(locale, "failedToDeleteQueue"));
        }
      };

      return (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{translate(locale, "editQueue")}</DialogTitle>
              </DialogHeader>
              <QueueForm
                initialData={queue}
                onSuccess={() => {
                  setOpen(false);
                  window.location.reload();
                }}
              />
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            {queue.status === "skipped" ? (
              <Button onClick={handleUnskip} variant="outline" size="sm">
                {translate(locale, "unskip")}
              </Button>
            ) : (
              <Button onClick={handleSkip} variant="outline" size="sm">
                {translate(locale, "skip")}
              </Button>
            )}
            <Button onClick={() => setOpen(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{translate(locale, "deleteQueue")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {translate(locale, "deleteQueueDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter     className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} gap-2`}
                >
                  <AlertDialogCancel>{translate(locale, "cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600  hover:bg-white hover:text-red-600">
                    {translate(locale, "delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      );
    },
  },
];