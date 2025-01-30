"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AgeCateforyEditFormProps {
  ageCategoryId: string;
  eventId: string;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1)
})

export const AgeCateforyEditForm = ({
  eventId,
  ageCategoryId,
  onClose
}: AgeCateforyEditFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const handleEdit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}/ageCategories/${ageCategoryId}`, values);
      toast.success("Kategoria zaktualizowana");
      onClose();
      router.refresh();
    } catch {
      toast.error("Coś poszło nie tak");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Nowa nazwa kategorii"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Zapisz zmiany
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AgeCateforyEditForm;