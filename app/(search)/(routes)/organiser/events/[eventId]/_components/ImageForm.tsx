"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import  z from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ImageIcon, ImagePlus, PenLine, PenOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Uploader from "@/components/Uploader";
import Image from "next/image";

interface ImageFormProps{
    eventData: Event
    eventId: string;
    
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message:" Tło jest wymagane"
    })
})

export const DescriptionForm = ({
    eventData,
    eventId
}: ImageFormProps) =>{

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            imageUrl: eventData?.imageUrl || ""
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    const editingState =() => setIsEditing((current) =>!current)

    const router = useRouter();

    
    const handleSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            await axios.patch(`/api/events/${eventId}`, values)
            toast.success("Wydarzenie zaktualizowane")
            editingState();
            router.refresh();
        } catch {
            toast.error("Coś poszło nie tak")
        }
    }
    return(
        <div className={cn(
                "mt-6 border rounded-full",
                eventData.imageUrl ? "bg-green-100 p-40" : "bg-gray-100 p-20"
              )}>
            <div className="font-md flex items-center justify-between">
                Tło wydarzenia
                <Button onClick={editingState} variant="outline" className="rounded-full">
                {isEditing && (
                    <>
                        <PenOff className="h-4 w-4 mr-2"/>
                        Anuluj
                    </>
                )}
                {!isEditing && !eventData.imageUrl && (
                    <>
                        <ImagePlus className="h-4 w-4 mr-2"/>
                        Dodaj
                    </>
                )}
                {!isEditing && eventData.imageUrl && (
                    <>
                        <PenLine className="h-4 w-4 mr-2"/>
                        Edytuj
                    </>
                )} 
                </Button>
            </div>
            {!isEditing && (
                !eventData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-full">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ):(
                    <div className="relative aspect-video mt-2">
                        <Image
                        alt="Upload"
                        fill
                        className="object-cover rounded-full"
                        src={eventData.imageUrl}
                        />
                    </div>
                )


            )}
            {isEditing && (
                <div>
                    <Uploader
                    endpoint="eventImage"
                    onChange={(url) => {
                        console.log("recived url:", url)
                        if(url){
                            handleSubmit({imageUrl: url})
                        }
                    }}
                    />
                </div>
            )}
        </div>
    )
}
 
export default DescriptionForm;