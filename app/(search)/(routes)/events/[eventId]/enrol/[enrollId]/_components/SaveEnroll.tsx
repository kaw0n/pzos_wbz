"use client"

import { Button } from "@/components/ui/button";
import { Competitor, Enroll } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface SaveEnrollProps {
    enrollData: Enroll & { competitors: Competitor[] };
    eventId: string;
    enrollId: string;
}

const SaveEnroll = ({ 
    enrollData,
    eventId,
    enrollId

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
        <Button
        onClick={() => handleUpdate(enrollId)}>
            Wyślij zgłoszenie
        </Button>
     );
}
 
export default SaveEnroll
