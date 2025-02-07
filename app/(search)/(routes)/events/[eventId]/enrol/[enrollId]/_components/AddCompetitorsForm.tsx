"use client";

import { AgeCategory, Competitor, Enroll } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CircleDot, FilePlus, LoaderCircle, PenLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface AgeCategoryOption {
  label: string;
  value: string;
  eventId: string;
}

interface AddCompetitorsFormProps {
  enrollData: Enroll & { competitors: (Competitor & {ageCategory: AgeCategory})[]; };
  enrollId: string;
  eventId: string;
  ageCategories: AgeCategoryOption[];
}

const formSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  chip: z.number().min(499999).max(9999999),
  ageCategoryId: z.string().min(1),
});

export const AddCompetitorsForm = ({
  enrollData,
  enrollId,
  eventId,
  ageCategories
}: AddCompetitorsFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues:{
        name: "",
        surname: "",
        ageCategoryId: "",
        chip: undefined
      }
    });

  const [deleting, setDeleting] = useState<string | null>(null);

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/events/${eventId}/enroll/${enrollId}/competitors`, values);
      toast.success("Zawodnik dodany");
      form.reset();
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Zawodnik z tym numerem chip już istnieje w tym wydarzeniu");
          return;
        }
      }
      toast.error("Coś poszło nie tak");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await axios.delete(`/api/events/${eventId}/enroll/${enrollId}/competitors/${id}`);
      toast.success("Zawodnik usunięty");
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
      "m-6 border rounded-3xl p-6",
      enrollData.competitors.length === 0 ? "bg-gray-100" : "bg-green-100"
    )}>
      <div className="font-md flex items-center justify-between">
        Zawodnicy
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="rounded-full">
              <FilePlus className="h-4 w-4 mr-2" />
              Dodaj
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dodaj Zawodnika</AlertDialogTitle>
            </AlertDialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imię zawodnika</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="np. 'Jan'"
                          {...field}
                        />
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
                        <Input
                          disabled={isSubmitting}
                          placeholder="np. 'Kowalski'"
                          {...field}
                        />
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
                        <Input
                          type="number"
                          disabled={isSubmitting}
                          placeholder="np. '887230'"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                            .filter(ageCategory=> ageCategory.eventId === eventId)
                            .map((ageCategory) => (
                              <SelectItem key={ageCategory.value} value={ageCategory.value}>
                                {ageCategory.label}
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
                  <AlertDialogCancel onClick={() => form.reset()}>
                    Anuluj
                  </AlertDialogCancel>
                  <AlertDialogAction
                  type="submit"
                  disabled={ !isValid || isSubmitting}
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

      {enrollData.competitors.length === 0 ? (
        <p className="text-sm mt-2 text-slate-500 italic">Brak kategorii</p>
      ) : (
        <div className="space-y-2">
          {enrollData.competitors.map((competitor) => (
            <div
              key={competitor.id}
              className="flex items-center p-3 mt-4 w-full bg-green-200 border rounded-full"
            >
              <CircleDot className="h-4 w-4 mr-2 flex-shrink-0 text-green-600"/>
              <p className="text-xs line-clamp-1 text-green-600">
                Imię i nazwisko: {competitor.name + " " + competitor.surname + " "}
                Numer karty SI: {competitor.chip + " "}
                Kategoria: {competitor.ageCategory.name}
              </p>
              <div className="ml-auto flex items-center gap-2">
                {deleting === competitor.id ? (
                  <LoaderCircle className="h-4 w-4 animate-spin"/>
                ) : (
                  <>
                    <Button
                    onClick={() => handleDelete(competitor.id)}
                    variant="outline"
                    className="hover:opacity-75 hover:border-red-600 hover:text-red-600 hover:bg-red-100 rounded-full"
                    size="icon"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                    
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

export default AddCompetitorsForm;
