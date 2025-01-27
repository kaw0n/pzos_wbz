"use client";

import { AgeCategory, Event } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CircleDot, FilePlus, LoaderCircle, PenOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilesFormProps {
  eventData: Event & { ageCategories: AgeCategory[] };
  eventId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const FilesForm = ({
  eventData,
  eventId,
}: FilesFormProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const editingState = () => setIsEditing((current) => !current);

  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/events/${eventId}/ageCategories`, values);
      toast.success("Wydarzenie zaktualizowane");
      router.refresh();
    } catch {
      toast.error("Coś poszło nie tak");
    }
  };

  const handleDelete = async (id: string) => {
    try{
        setDeleting(id)
        await axios.delete(`/api/events/${eventId}/ageCategories/${id}`)
        toast.success("Kategoria usunięta")
        router.refresh()

    }catch(error){
        console.log(error)
        toast.error("Coś poszło nie tak")
    }finally{
        setDeleting(null)
    }
  }


  return (
    <div
      className={cn(
        "mt-6 border rounded-3xl p-6",
        eventData.ageCategories.length===0 ? "bg-gray-100" : "bg-green-100"
      )}
    >
      <div className="font-md flex items-center justify-between">
        Kategorie
        <Button onClick={async () => {
    await handleSubmit({name: ""});
  }} variant="outline" className="rounded-full">
          {!isEditing && (
            <>
              <FilePlus className="h-4 w-4 mr-2" />
              Dodaj
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
            {eventData.ageCategories.length === 0 && (
                <p className="text-sm mt-2 text-slate-500 italic">
                    Brak kategorii
                </p>
            )}
            {eventData.ageCategories.length > 0 && (
                <div className="space-y-2">
                {eventData.ageCategories.map((ageCategory) => (
                    <div
                    key={ageCategory.id}
                    className="flex items-center p-3 mt-4 w-full bg-green-200  border  rounded-full"
                    >
                        <CircleDot className="h-4 w-4 mr-2 flex-shrink-0 text-green-600"/>
                        <p className="text-xs line-clamp-1 text-green-600">
                            {ageCategory.name}
                        </p>
                        {deleting === ageCategory.id &&(
                            <div>
                                <LoaderCircle className="h-4 w-4 animate-spin"/>
                            </div>
                        )}
                        {deleting !== ageCategory.id &&(
                            <Button
                            className="ml-auto hover:opacity-75 hover:border-red-600 hover:text-red-600 hover:bg-red-100 border-2 transition rounded-full "
                            variant="outline"
                            onClick={()=>handleDelete(ageCategory.id)}
                            >
                                <Trash2 className="h-4 w-4 "/>
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            )}
        </>
      )}
    </div>
  );
};

export default FilesForm;
