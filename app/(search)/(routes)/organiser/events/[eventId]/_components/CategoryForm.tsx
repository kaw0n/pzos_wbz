"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { PenLine, PenOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

interface CategoryOption {
  label: string;
  value: string;
}

interface CategoryFormProps {
  eventData: { categoryId?: string | null };
  eventId: string;
  options: CategoryOption[];
}

const formSchema = z.object({
  category: z.string().min(1, {
    message: "Wybór kategorii jest wymagany",
  }),
});

export const CategoryForm = ({
    eventData,
    eventId,
    options,
}: CategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: eventData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter()

  const editingState = () => setIsEditing((current) => !current);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

      await axios.patch(`/api/events/${eventId}`, {categoryId: values.category});
      toast.success("Kategoria zaktualizowana");
      editingState();
      router.refresh()
    } catch (error) {
      toast.error("Coś poszło nie tak");
    }
  };

  return (
    <div
      className={cn(
        "mt-6 border rounded-full p-10",
        eventData.categoryId ? "bg-green-100" : "bg-gray-100"
      )}
    >
      <div className="font-md flex items-center justify-between">
        Rodzaj wydarzenia
        <Button onClick={editingState} variant="outline" className="rounded-full">
          {isEditing ? (
            <>
              <PenOff className="h-4 w-4 mr-2" />
              Anuluj
            </>
          ) : (
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
            !eventData.categoryId && "text-slate-500 italic"
          )}
        >
          {options.find((opt) => opt.value === eventData.categoryId)?.label ||
            "Nie wybrano kategorii"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
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

export default CategoryForm;
