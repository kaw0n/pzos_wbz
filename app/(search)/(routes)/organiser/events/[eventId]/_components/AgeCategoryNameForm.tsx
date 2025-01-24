"use client"

import { zodResolver } from "@hookform/resolvers/zod";
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

interface AgeCateforyNameFormProps{
    ageCategoryId: string;
    eventId: string;
    
}

const formSchema = z.object({
    name: z.string().min(1)
})

export const AgeCateforyNameForm = ({
    eventId,
    ageCategoryId
}: AgeCateforyNameFormProps) =>{

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { isSubmitting, isValid} = form.formState;

    const [isEditing, setIsEditing] = useState(false);

    const editingState =() => setIsEditing((current) =>!current)

    const router = useRouter();

    
    const handleSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            await axios.patch(`/api/events/${eventId}/ageCategories/${ageCategoryId}`, values)
            toast.success("Kategoria zaktualizowana")
            editingState();
            router.refresh();
        } catch {
            toast.error("Coś poszło nie tak")
        }
    }
    return(
        <div className="flex flex-row">
            <div className="font-medium flex items-center justify-between">
                <Button onClick={editingState} variant="outline" className="rounded-full ml-2">
                    {isEditing &&(
                        <>
                            <PenOff className="h-4 w-4"/>
                        </>
                    )}
                    {!isEditing &&(
                        <>
                            <PenLine className="h-4 w-4"/>
                        </>
                    )}
                    
                </Button>
            </div>
            {isEditing && (
                <div className="">
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="ml-4 space-x-4 flex flex-row">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                    disabled={isSubmitting}
                                    placeholder="np. 'M-21'"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                            className="rounded-full"
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Zapisz
                            </Button>
                        </div>
                    </form>
                </Form>
                </div>
            )}
        </div>
    )
}
 
export default AgeCateforyNameForm;