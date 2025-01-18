"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import  z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { PenLine, PenOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TitleFormProps{
    eventData: Event
    eventId: string;
    
}

const formSchema = z.object({
    title: z.string().min(1, {
        message:" Nazwa jest wymagana"
    })
})

export const TitleForm = ({
    eventData,
    eventId
}: TitleFormProps) =>{

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            title: eventData?.title || ""
        },
    });

    const { isSubmitting, isValid} = form.formState;

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
            "mt-6 border rounded-full p-10",
            eventData.title ? "bg-green-100" : "bg-gray-100"
        )}>
            <div className="font-medium flex items-center justify-between">
                Nazwa wydarzenia
                <Button onClick={editingState} variant="outline" className="rounded-full">
                    {isEditing &&(
                        <>
                            <PenOff className="h-4 w-4 mr-2"/>
                            Anuluj
                        </>
                    )}
                    {!isEditing &&(
                        <>
                            <PenLine className="h-4 w-4 mr-2"/>
                            Edytuj
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing &&(
                <p className={cn(
                    "text-sm mt-2",
                    !eventData.title && "text-slate-500 italic"
                )}>
                    {eventData.title || "Brak tytułu"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                    disabled={isSubmitting}
                                    placeholder="np. 'Baltic Cup'"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Zapisz
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
 
export default TitleForm;