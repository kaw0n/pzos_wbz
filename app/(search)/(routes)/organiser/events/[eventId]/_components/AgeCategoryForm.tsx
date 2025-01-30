"use client";

import { AgeCategory, Event } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CircleDot, FilePlus, LoaderCircle, PenLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AgeCateforyEditForm from "./AgeCategoryEditForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
 } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AgeCategoriesFormProps {
  eventData: Event & { ageCategories: AgeCategory[] };
  eventId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const AgeCategoriesForm = ({
  eventData,
  eventId,
}: AgeCategoriesFormProps) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitting values:", values);
    try {
      await axios.post(`/api/events/${eventId}/ageCategories`, values);
      toast.success("Kategoria dodana");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Coś poszło nie tak");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await axios.delete(`/api/events/${eventId}/ageCategories/${id}`);
      toast.success("Kategoria usunięta");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Coś poszło nie tak");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={cn(
      "mt-6 border rounded-3xl p-6",
      eventData.ageCategories.length === 0 ? "bg-gray-100" : "bg-green-100"
    )}>
      <div className="font-md flex items-center justify-between">
        Kategorie
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="rounded-full">
              <FilePlus className="h-4 w-4 mr-2" />
              Dodaj
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dodaj Kategorię wiekową</AlertDialogTitle>
            </AlertDialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa kategorii</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="np. 'M-21'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel onClick={() => form.reset()}>
                    Anuluj
                  </AlertDialogCancel>
                  <AlertDialogAction
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  >
                      {isSubmitting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Utwórz"
                      )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </Form>
            
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {eventData.ageCategories.length === 0 ? (
        <p className="text-sm mt-2 text-slate-500 italic">Brak kategorii</p>
      ) : (
        <div className="space-y-2">
          {eventData.ageCategories.map((ageCategory) => (
            <div
              key={ageCategory.id}
              className="flex items-center p-3 mt-4 w-full bg-green-200 border rounded-full"
            >
              <CircleDot className="h-4 w-4 mr-2 flex-shrink-0 text-green-600"/>
              <p className="text-xs line-clamp-1 text-green-600">
                {ageCategory.name}
              </p>
              
              <div className="ml-auto flex items-center gap-2">
                {deleting === ageCategory.id ? (
                  <LoaderCircle className="h-4 w-4 animate-spin"/>
                ) : (
                  <>
                    <Button
                    onClick={() => handleDelete(ageCategory.id)}
                    variant="outline"
                    className="hover:opacity-75 hover:border-red-600 hover:text-red-600 hover:bg-red-100 rounded-full"
                    size="icon"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          size="icon"
                        >
                          <PenLine className="h-4 w-4"/>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edytuj kategorię</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AgeCateforyEditForm
                          eventId={eventId}
                          ageCategoryId={ageCategory.id}
                          onClose={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
                        />
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgeCategoriesForm;