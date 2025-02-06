"use client"

import { useState, useMemo, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Combobox } from "@/components/Combobox"
import { DataTable } from "./DataTable"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, FilePlus, LoaderCircle, PenLine, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { AgeCategory, Competitor } from "@prisma/client"
import { EditCompetitorsForm } from "./EditCompetitorsForm"
import axios from "axios"
import toast from "react-hot-toast"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { ConfirmModal } from "@/components/modals/ConfirmModal"



type CompetitorWithAgeCategory = Competitor & {
  ageCategory: AgeCategory
}

interface EventsComboboxProps {
  events: {
    id: string
    title: string
    competitors: CompetitorWithAgeCategory[]
    ageCategories: AgeCategory[]
  }[]
}

const formSchema = z.object({
    name: z.string().min(1),
    surname: z.string().min(1),
    chip: z.number().min(1),
    ageCategoryId: z.string().min(1),
});

export const EventsCombobox = ({ events }: EventsComboboxProps) => {
  const router = useRouter()
  
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<string>("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [competitors, setCompetitors] = useState<CompetitorWithAgeCategory[]>([])
  const [isEditing, setEditing] = useState<CompetitorWithAgeCategory | null>(null)

  useEffect(() => {
    if (!selectedEventId) {
      setCompetitors([])
    } else {
      const eventCompetitors = events.find(e => e.id === selectedEventId)?.competitors || []
      setCompetitors(eventCompetitors)
    }
  }, [events, selectedEventId])

  const eventOptions = events.map(event => ({
    label: event.title,
    value: event.id
  }))

  const ageCategories = useMemo(() => {
    if (!selectedEventId) return []
    const event = events.find(e => e.id === selectedEventId)
    if (!event) return []
    
    return (event.ageCategories ?? []).map(cat => {
      const hasCompetitors = competitors.some(
        c => c.ageCategory?.name === cat.name
      )
      return {
        label: hasCompetitors ? cat.name : `${cat.name} (Brak zawodników)`,
        value: cat.id,
      }
    })
  }, [selectedEventId, events, competitors])
  
  const filteredCompetitors = useMemo(() => {
    return selectedAgeCategory
      ? competitors.filter(c => c.ageCategory?.id === selectedAgeCategory)
      : competitors
  }, [competitors, selectedAgeCategory])

  const deleteUser = async (id: string) => {
    try {
      setDeleting(id)
      await axios.delete(`/api/competitors/${id}`)
      
      setCompetitors(prev => prev.filter(c => c.id !== id))
      toast.success("Zawodnik usunięty")
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error("Coś poszło nie tak")
      setCompetitors(prev => [...prev])
    } finally {
      setDeleting(null)
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      name: "",
      surname: "",
      ageCategoryId: "",
      chip: undefined
    }
});

const { isSubmitting, isValid } = form.formState;

const handleCreate = async (values: z.infer<typeof formSchema>) => {
  try {
    await axios.post(`/api/competitors`,{
        ...values,
        chip: Number(values.chip),
        eventId: selectedEventId});
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
  
  const columns: ColumnDef<CompetitorWithAgeCategory>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Imię
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "surname",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nazwisko
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "chip",
      header: "Numer karty SI",
    },
    {
      accessorKey: "ageCategory",
      header: () => (
        <div className="flex items-center gap-x-2">
          Kategoria wiekowa
          <Combobox
            options={ageCategories}
            value={selectedAgeCategory}
            onChange={setSelectedAgeCategory}
          />
        </div>
      ),
      cell: ({ row }) => row.original.ageCategory?.name
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const competitor = row.original
        return (
          <div className="flex gap-2">
            <Button
              className="rounded-full hover:opacity-75 hover:border-green-600 hover:bg-green-100 hover:text-green-600  hover:br-green-100  hover:border-2 transition"
              variant="outline"
              size="icon"
              onClick={() => {
                setEditing(null);
                setTimeout(() => setEditing(competitor), 0);
              }}
              disabled={deleting === competitor.id}
            >
              <PenLine className="h-4 w-4" />
            </Button>
            <ConfirmModal handleConfirm={() => deleteUser(competitor.id)}> 
              <Button
              className="rounded-full hover:opacity-75 hover:border-red-600 hover:bg-red-100 hover:text-red-600  hover:br-red-100  hover:border-2 transition"
                variant="outline"
                size="icon"
                disabled={deleting === competitor.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </ConfirmModal>
          </div>
        )
      }
    }
  ]

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-y-4">
        <div className="text-lg font-semibold">
          Wybierz wydarzenie, z którego chcesz zobaczyć zawodników
        </div>
        <Combobox 
          options={eventOptions}
          value={selectedEventId}
          onChange={setSelectedEventId}
        />
      </div>
      
      {isEditing && (
        <EditCompetitorsForm
          key={isEditing.id}
          competitor={isEditing}
          ageCategories={events.find(e => e.id === selectedEventId)?.ageCategories || []}
          id={isEditing.id}
        />
      )}
        
      <DataTable 
        key={competitors.length}
        columns={columns} 
        data={filteredCompetitors} 
      />
      {selectedEventId && (
        <div className="font-md flex items-center justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="rounded-full">
              <FilePlus className="h-4 w-4 mr-2" />
              Dodaj zawodnika
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
                            {ageCategories.map((ageCategory) => (
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
      )}
    </div>
  )
}
