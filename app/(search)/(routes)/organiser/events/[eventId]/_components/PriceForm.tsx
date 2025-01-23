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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps{
    eventData: Event
    eventId: string;
    
}

const formSchema = z.object({
    price: z.coerce.number()
})

export const PriceForm = ({
    eventData,
    eventId
}: PriceFormProps) =>{

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            price: eventData?.price || 0
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
                "mt-6 border rounded-full p-6",
                eventData.price ? "bg-green-100" : "bg-gray-100"
              )}>
            <div className="font-md flex items-center justify-between">
                Cena wpisowego
                <Button onClick={editingState} variant="outline" className="rounded-full">
                {isEditing ? (
                    <>
                    <PenOff className="h-4 w-4 mr-2"/>
                    Anuluj
                    </>
                ):(
                    <>
                        <PenLine className="h-4 w-4 mr-2"/>
                        Edytuj
                    </>
                )} 
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !eventData.price && "text-slate-500 italic"
                )}>
                    {eventData.price ? formatPrice(eventData.price) : "Brak ceny"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        type="number"
                                        step="0.01"
                                        disabled={isSubmitting}
                                        placeholder="np. 20"
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
 
export default PriceForm;