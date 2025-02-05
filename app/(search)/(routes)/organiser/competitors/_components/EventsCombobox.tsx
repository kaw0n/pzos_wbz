// app/(dashboard)/_components/CompetitorsView.tsx
"use client"

import { useState, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Combobox } from "@/components/Combobox"
import { DataTable } from "./DataTable"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, PenLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { AgeCategory, Competitor } from "@prisma/client"

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

  const allCompetitors = selectedEventId 
    ? events.find(e => e.id === selectedEventId)?.competitors || []
    : events.flatMap(event => event.competitors)

  const ageCategories = useMemo(() => {
    const categories = new Set<string>()
    allCompetitors.forEach(competitor => {
      if (competitor.ageCategory?.name) {
        categories.add(competitor.ageCategory.name)
      }
    })
    return Array.from(categories).map(cat => ({ label: cat, value: cat }))
  }, [allCompetitors])

  const filteredCompetitors = useMemo(() => {
    let result = allCompetitors
    if (selectedAgeCategory) {
      result = result.filter(competitor => 
        competitor.ageCategory?.name === selectedAgeCategory
      )
    }
    return result
  }, [allCompetitors, selectedAgeCategory])

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
      cell: ({ row }) => {
        const { id } = row.original
        return (
          <Button 
            variant="outline" 
            className="rounded-full" 
            onClick={() => router.push(`/organiser/events/${id}`)}
          >
            <PenLine className="h-4 w-4"/>
          </Button>
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
        columns={columns} 
        data={filteredCompetitors} 
      />
    </div>
  )
}