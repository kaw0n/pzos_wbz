"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem
} from "@/components/ui/form"


import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "@prisma/client";




interface IsSportIdentFormProps{
    eventData: Event
    eventId: string; 
}

const formSchema = z.object({
    ifSportIdent: z.boolean().default(true)
})

export const IsSportIdentForm = ({
    eventData,
    eventId,
}: IsSportIdentFormProps) =>{

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit =() => setIsEditing((current) =>!current)

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            ifSportIdent: !!eventData.ifSportIdent
        },
    });

    const { isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            await axios.patch(`/api/events/${eventId}`, values)
            toast.success("Rozdział zaktualizowany")
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Coś poszło nie tak")
        }
    }


    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-md flex items-center justify-between">
               SportIdent
                <Button onClick={toggleEdit} variant="outline">
                {isEditing ? (
                    <>Anuluj</>
                ):(
                    <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edytuj
                    </>
                )} 
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !eventData.ifSportIdent && "text-slate-500 italic"
                )}>
                    {eventData.ifSportIdent ?(
                        <>
                        Wydarzenie jest robione z użyciem SportIdent
                        </>
                    ): (
                        <>
                        Wydarzenie nie jest robione z użyciem SportIdent
                        </>
                    )}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="ifSportIdent"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Zaznacz ten checkbox jeżeli wydarzenie jest robione za z użyciem SportIdent
                                        </FormDescription>
                                    </div>
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