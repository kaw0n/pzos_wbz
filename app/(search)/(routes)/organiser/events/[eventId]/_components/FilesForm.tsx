"use client";

import { Event, File } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FileIcon, FilePlus, LoaderCircle, PenOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Uploader from "@/components/Uploader";

interface FilesFormProps {
  eventData: Event & { files: File[] };
  eventId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
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
      await axios.post(`/api/events/${eventId}/files`, values);
      toast.success("Wydarzenie zaktualizowane");
      editingState();
      router.refresh();
    } catch {
      toast.error("Coś poszło nie tak");
    }
  };

  const handleDelete = async (id: string) => {
    try{
        setDeleting(id)
        await axios.delete(`/api/events/${eventId}/files/${id}`)
        toast.success("Plik usunięty")
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
        eventData.files ? "bg-green-100" : "bg-gray-100"
      )}
    >
      <div className="font-md flex items-center justify-between">
        Pliki
        <Button onClick={editingState} variant="outline" className="rounded-full">
          {isEditing && (
            <>
              <PenOff className="h-4 w-4 mr-2" />
              Anuluj
            </>
          )}
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
            {eventData.files.length === 0 && (
                <p className="text-sm mt-2 text-slate-500 italic">
                    Brak plików
                </p>
            )}
            {eventData.files.length > 0 && (
                <div className="space-y-2">
                {eventData.files.map((file) => (
                    <div
                    key={file.id}
                    className="flex items-center p-3 mt-4 w-full bg-green-200  border text-green-600 rounded-full"
                    >
                        <FileIcon className="h-4 w-4 mr-2 flex-shrink-0"/>
                        <p className="text-xs line-clamp-1">
                            {file.name}
                        </p>
                        {deleting === file.id &&(
                            <div>
                                <LoaderCircle className="h-4 w-4 animate-spin"/>
                            </div>
                        )}
                        {deleting !== file.id &&(
                            <Button
                            className="ml-auto hover:opacity-75 hover:border-red-600 hover:text-red-600 hover:bg-red-100 border-2 transition rounded-full "
                            variant="outline"
                            onClick={()=>handleDelete(file.id)}
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
      {isEditing && (
        <div className="h-60 w-full">
          <Uploader
            endpoint="eventFile"
            onChange={(url) => {
              if (url) {
                handleSubmit({ url : url  });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FilesForm;
