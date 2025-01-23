"use client"

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteActionProps {
    eventId: string;
}

export const DeleteAction = ({
    eventId,
}: DeleteActionProps) =>{

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleDelete = async () =>{
        try{
            setIsLoading(true)
            await axios.delete(`/api/events/${eventId}`)
            toast.success("Wydarzenie zostało usunięte");
            router.refresh()
            router.push(`/organiser/events/`)

        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className="flex justify-end">
            <ConfirmModal handleConfirm={handleDelete}>
                <Button
                variant="outline"
                className="rounded-full hover:opacity-75 hover:border-red-600 hover:bg-red-100 hover:text-red-600  hover:br-red-100  hover:border-2 transition"
                size="sm"
                disabled={isLoading}
                >
                    <Trash2 className="h-4 w-4"/>
                    Usuń wydarzenie
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default DeleteAction;