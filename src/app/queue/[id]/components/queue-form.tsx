"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQueue } from "@/app/QueueContext";
import { useLanguage } from "../../../../../context/LanguageContext";
import { translate } from "../../../../../utils/translations";

const formSchema = z.object({
  number: z.number().min(1),
  username: z.string().optional(),
  status: z.string()
});

type QueueFormValues = z.infer<typeof formSchema>;

interface QueueFormProps {
  initialData: {
    id: number;
    number: number;
    username: string | null;
    status: string;
  } | null;
  onSuccess?: () => void;
}

const QueueForm: React.FC<QueueFormProps> = ({
  initialData,
  onSuccess
}) => {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const { updateQueue, addQueue, removeQueue } = useQueue();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? translate(locale, "editQueue") : translate(locale, "createQueue");
  const description = initialData ? translate(locale, "") : translate(locale, "");
  const toastMessage = initialData ? translate(locale, "queueUpdated") : translate(locale, "queueCreated");
  const action = initialData ? translate(locale, "saveChanges") : translate(locale, "create");

  const form = useForm<QueueFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: initialData?.number || 1,
      username: initialData?.username || "",
      status: (initialData?.status as "waiting" | "served" | "skipped") || "waiting"
    }
  });

  const onSubmit = async (data: QueueFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const response = await axios.patch(`/api/queues/actions`, {
          queueId: initialData.id,
          ...data
        });
        
        // Update local state instead of reloading
        updateQueue(initialData.id, {
          ...initialData,
          ...data,
          username: data.username || null
        });
        
        toast.success(toastMessage);
      } else {
        const response = await axios.post('/api/queues', data);
        
        // Add to local state instead of reloading
        addQueue({
          ...response.data,
          createdAt: new Date().toISOString()
        });
        
        toast.success(toastMessage);
      }
      onSuccess?.();
    } catch (error) {
      toast.error(translate(locale, "failedToSaveQueue"));
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/queues/${params.queueId}`);
      
      // Remove from local state instead of reloading
      if (initialData) {
        removeQueue(initialData.id);
      }
      
      router.push('/queues');
      toast.success(translate(locale, "queueDeleted"));
    } catch (error) {
      toast.error(translate(locale, "somethingWentWrong"));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
      </div>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate(locale, "queueNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder={translate(locale, "enterQueueNumber")}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate(locale, "username")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={translate(locale, "enterUsername")}
                      {...field}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate(locale, "status")}</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder={translate(locale, "selectQueueStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiting">{translate(locale, "waiting")}</SelectItem>
                      <SelectItem value="served">{translate(locale, "served")}</SelectItem>
                      <SelectItem value="skipped">{translate(locale, "skipped")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onSuccess?.()}
            >
              {translate(locale, "cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? translate(locale, "saving") : action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QueueForm;
