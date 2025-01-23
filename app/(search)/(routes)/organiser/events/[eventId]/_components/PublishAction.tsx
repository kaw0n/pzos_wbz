"use client"

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface PublishActionProps {
    disabled: boolean;
    eventId: string;
    isPublic: boolean
}

export const PublishAction = ({
    disabled,
    eventId,
    isPublic
}: PublishActionProps) =>{

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleClick = async () =>{
        try{
            setIsLoading(true)

            if(isPublic){
                await axios.patch(`/api/events/${eventId}/unpublish`)
                toast.success("Publikacja wydarzenia została cofnięta")
            } else {
                await axios.patch(`/api/events/${eventId}/publish`)
                toast.success("Wydarzenie opublikowane")
            }

            router.refresh();

        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className="flex w-full justify-end">
            <Button
            onClick={handleClick}
            disabled={disabled || isLoading}
            variant="outline"
            className="rounded-full opacity-75 border-yellow-500 text-yellow-600 bg-yellow-100 border-2 p-4 transition"
            size="lg"
            >
                {isPublic ? "Cofnij publikację" : "Opublikuj"}
            </Button>
        </div>
    )
}

export default PublishAction;