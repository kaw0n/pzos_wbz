"use client"

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PenLine, PenOff } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DatePicker from "./DatePicker";

interface DateFormProps {
  initialData: Event;
  eventId: string;
}

const formSchema = z.object({
  date: z.date(),
});

export const DateForm = ({ initialData, eventId }: DateFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialData.date ? new Date(initialData.date) : new Date(),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}`, values);
      toast.success("Wydarzenie zaktualizowane");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Coś poszło nie tak");
    }
  };

  return (
    <div
      className={cn(
        "mt-6 border rounded-full p-10",
        initialData.date ? "bg-green-100" : "bg-gray-100"
      )}
    >
      <div className="font-medium flex items-center justify-between">
        Data wydarzenia
        <Button onClick={toggleEdit} variant="outline" className="rounded-full">
          {isEditing && (
            <>
              <PenOff className="h-4 w-4 mr-2" />
              Anuluj
            </>
          )}
          {!isEditing && (
            <>
              <PenLine className="h-4 w-4 mr-2" />
              Edytuj
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.date && "text-slate-500 italic"
          )}
        >
          {initialData?.date
            ? format(new Date(initialData.date), "PPP")
            : "Brak daty"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <DatePicker field={field} />
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Zapisz
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DateForm;
