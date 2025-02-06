"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
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
import { Combobox } from "@/components/Combobox";
import { z } from "zod";
import { AgeCategory, Competitor } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type CompetitorWithAgeCategory = Competitor & {
  ageCategory: AgeCategory
}

interface EditFormProps {
  id: string
  competitor: CompetitorWithAgeCategory;
  ageCategories: AgeCategory[];
  onSuccess: (updatedCompetitor: CompetitorWithAgeCategory) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  surname: z.string().min(1, "Nazwisko jest wymagane"),
  chip: z.number().min(1, "Numer karty SI jest wymagany"),
  ageCategoryId: z.string().min(1, "Kategoria wiekowa jest wymagana"),
});

export const EditCompetitorsFormOrganiser = ({ 
  competitor,
  ageCategories,
  id,
  onSuccess
}: EditFormProps) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    form.reset({
      name: competitor.name,
      surname: competitor.surname,
      chip: competitor.chip,
      ageCategoryId: competitor.ageCategoryId
    });
  }, [competitor, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      console.log("Wysyłane dane:", { ...values, chip: Number(values.chip), eventId: competitor.eventId });
      const response = await axios.patch(`/api/competitors/${id}`, {
        ...values,
        chip: Number(values.chip),
        eventId: competitor.eventId
      });
      
      toast.success("Zawodnik zaktualizowany");
      onSuccess(response.data);
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
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset();
        setOpen(false);
        onSuccess(competitor);
      }
    }}>
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
                  <Combobox
                    options={ageCategories.map(ageCategory => ({
                      label: ageCategory.name,
                      value: ageCategory.id
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Anuluj
            </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? "Zapisywanie..." : "Zapisz zmiany"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};