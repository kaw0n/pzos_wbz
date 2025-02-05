// app/(dashboard)/_components/CompetitorsView.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Combobox } from "@/components/Combobox"
import { DataTable } from "./DataTable"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, PenLine, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { AgeCategory, Competitor } from "@prisma/client"
import { EditCompetitorsFormOrganiser } from "./AddCompetitorsFormOrganiser"
import axios from "axios"
import toast from "react-hot-toast"

type CompetitorWithAgeCategory = Competitor & {
  ageCategory: AgeCategory
}

interface EventsComboboxProps {
  events: {
    id: string
    title: string
    competitors: CompetitorWithAgeCategory[]
  }[]
}

export const EventsCombobox = ({ events }: EventsComboboxProps) => {
    const router = useRouter()
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [selectedAgeCategory, setSelectedAgeCategory] = useState<string>("")
    const [deleting, setDeleting] = useState<string | null>(null)
    const [competitors, setCompetitors] = useState<CompetitorWithAgeCategory[]>([])
  
    
    useEffect(() => {
      const initialCompetitors = selectedEventId 
        ? events.find(e => e.id === selectedEventId)?.competitors || []
        : events.flatMap(event => event.competitors)
      setCompetitors(initialCompetitors)
    }, [events, selectedEventId])
  
    const ageCategories = useMemo(() => {
      const categories = new Set<string>()
      competitors.forEach(competitor => {
        if (competitor.ageCategory?.name) {
          categories.add(competitor.ageCategory.name)
        }
      })
      return Array.from(categories).map(cat => ({ label: cat, value: cat }))
    }, [competitors])
  
    const filteredCompetitors = useMemo(() => {
      return selectedAgeCategory
        ? competitors.filter(c => c.ageCategory?.name === selectedAgeCategory)
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

  const columns: ColumnDef<CompetitorWithAgeCategory>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Imie
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
      cell: ({ row }: { row: any }) => {
        const { id } = row.original
        return (
            <div className="flex items-center gap-x-2">
                <Button 
                variant="outline" 
                className="rounded-full" 
                onClick={() => deleteUser(id)}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
                <Button 
            variant="outline" 
            className="rounded-full" 
            onClick={() => {}}>
              <PenLine className="h-4 w-4"/>
            </Button>
            </div>
            
        )
      }
    }
  ]

  const eventOptions = events.map(event => ({
    label: event.title,
    value: event.id
  }))

  return (
    <div className="p-6 space-y-4">
      <Combobox 
        options={eventOptions}
        value={selectedEventId}
        onChange={setSelectedEventId}
      />
      
      <DataTable
        key={competitors.length} 
        columns={columns} 
        data={filteredCompetitors} 
      />
    </div>
  )
}