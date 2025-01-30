"use client"

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Params {
    eventId: string;
    enrollId: string;
}

const DeleteEnroll = ({ params }: { params: Params }) => {

    const [deleting, setDeleting] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
            try {
                setDeleting(id)
                await axios.delete(`/api/events/${params.eventId}/enroll/${params.enrollId}`)
                toast.success("Pomyślnie przerwano")
                router.push(`/events/${params.eventId}`)
    
            } catch (error) {
                console.log(error)
                toast.error("Coś poszło nie tak")
            } finally {
                setDeleting(null)
            }
        }
    return ( 
        <Button
        onClick={() => handleDelete(params.enrollId)}>
            Wyjdź
        </Button>
     );
}
 
export default DeleteEnroll
