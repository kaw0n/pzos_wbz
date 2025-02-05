// app/(dashboard)/_components/CompetitorEditForm.tsx
"use client";

import { useState } from "react";
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
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  chip: z.number().min(1),
  ageCategoryId: z.string().min(1),
});

"use client";

import { useEffect } from "react"; // Dodany hook

export const EditCompetitorsFormOrganiser = ({ 
  competitor,
  ageCategories,
  id,
  onSuccess
}: EditFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { // Uzupełnione defaultowe wartości
      name: competitor.name,
      surname: competitor.surname,
      chip: competitor.chip,
      ageCategoryId: competitor.ageCategoryId
    }
  });

  // Resetuj formularz przy zmianie zawodnika
  useEffect(() => {
    form.reset({
      name: competitor.name,
      surname: competitor.surname,
      chip: competitor.chip,
      ageCategoryId: competitor.ageCategoryId
    });
  }, [competitor]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/competitors/${id}`, {
        ...values,
        chip: Number(values.chip) // Konwersja na number
      });
      
      toast.success("Zawodnik zaktualizowany");
      onSuccess(response.data); // Wywołanie callbacka z nowymi danymi
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
    <AlertDialog open={open} onOpenChange={setOpen}>
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <FormLabel>Numer karty SI zawodnika</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                    options={ageCategories.map(c => ({
                      label: c.name,
                      value: c.id
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};