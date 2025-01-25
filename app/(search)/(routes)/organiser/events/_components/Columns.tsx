"use client"

import { Button } from "@/components/ui/button"
import { Event } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Link, PenLine } from "lucide-react"
import { useRouter } from "next/navigation"


export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Nazwa",
  },
  {
    accessorKey: "conmetitors",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Liczba zapisanych uczestników
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data wydarzenia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = row.original.date ? new Date(row.original.date) : null;
        return date?.toLocaleDateString("pl-PL", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
  },
  {
    id: "actions",
    cell: ({row}) =>{
      const router = useRouter();
        const {id} = row.original

        const handleEdit = (id: string) => {
          router.push(`/organiser/events/${id}`);
        };

        return(        
          <Button 
          variant="outline" 
          className="rounded-full" 
          onClick={() => handleEdit(id)}>
            <PenLine className="h-4 w-4"/>
          </Button>    
        )
    }
  }
]
