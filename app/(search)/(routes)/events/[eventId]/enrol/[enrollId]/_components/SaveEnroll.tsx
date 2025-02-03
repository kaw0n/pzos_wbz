"use client"

import { Button } from "@/components/ui/button";
import { Competitor, Enroll } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface SaveEnrollProps {
    eventId: string;
    enrollId: string;
    competitors: Competitor[];
}

const SaveEnroll = ({ 
    eventId,
    enrollId,
    competitors

}:SaveEnrollProps) => {

    const [editing, setEditing] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdate = async (id: string) => {
            try {
                setEditing(id)
                await axios.patch(`/api/events/${eventId}/enroll/${enrollId}`, {id})
                toast.success("Pomyślnie wysłano zgłoszenie")
                router.push(`/events/${eventId}`)
    
            } catch (error) {
                console.log(error)
                toast.error("Coś poszło nie tak podczas wysyłania zgłoszenia")
            } finally {
                setEditing(null)
            }
        }
    return ( 
        <div className="flex justify-end p-10">
            <Button
            disabled={competitors.length === 0}
            variant="outline"
            className="rounded-full hover:opacity-75 hover:border-green-600 hover:text-green-600 hover:bg-green-100"
            onClick={() => handleUpdate(enrollId)}>
            Wyślij zgłoszenie
        </Button>
        </div>
        
     );
}
 
export default SaveEnroll
