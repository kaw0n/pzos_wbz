"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { AgeCategory, Competitor } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CompetitorWithAgeCategory = Competitor & {
  ageCategory: AgeCategory
}

interface EditFormProps {
  id: string
  competitor: CompetitorWithAgeCategory;
  ageCategories: AgeCategory[];
}

const formSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  surname: z.string().min(1, "Nazwisko jest wymagane"),
  chip: z.number().min(1, "Numer karty SI jest wymagany"),
  ageCategoryId: z.string().min(1, "Kategoria wiekowa jest wymagana"),
});

export const EditCompetitorsForm = ({ 
  competitor,
  id,
  ageCategories
}: EditFormProps) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState<CompetitorWithAgeCategory | null>(null)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: competitor.name,
      surname: competitor.surname,
      chip: competitor.chip,
      ageCategoryId: competitor.ageCategoryId
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setEditing(competitor);
      await axios.patch(`/api/competitors/${id}`, {
        ...values,
        chip: Number(values.chip),
        eventId: competitor.eventId
      });
      
      toast.success("Zawodnik zaktualizowany");
      setOpen(false);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Zawodnik z tym numerem chip już istnieje");
          return;
        }
      }
      toast.error("Coś poszło nie tak");
    } finally {
      setLoading(false);
      setEditing(null);
    }
  };

  const { isSubmitting, isValid } = form.formState;

  return (
    <AlertDialog 
    open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset();
        setOpen(false);
      }
    }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edytuj Zawodnika</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię zawodnika</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Podaj imię" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwisko zawodnika</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Podaj nazwisko" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numer karty SI</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      placeholder="Podaj numer chipu"
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ageCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria wiekowa</FormLabel>
                  <FormControl>
                  <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz kategorię wiekową" />
                          </SelectTrigger>
                          <SelectContent>
                            {ageCategories
                            .map((ageCategory) => (
                              <SelectItem key={ageCategory.id} value={ageCategory.id}>
                                {ageCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel 
              onClick={() => setOpen(false)}
              >
                Anuluj
              </AlertDialogCancel>
              <AlertDialogAction
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              disabled={ !isValid || isSubmitting}
              >
                 Edytuj
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};