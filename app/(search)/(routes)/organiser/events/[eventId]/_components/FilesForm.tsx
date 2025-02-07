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
import FileNameForm from "./FileNameForm";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
 } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FilesFormProps {
  eventData: Event & { files: File[] };
  eventId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  visibleName: z.string().min(1),
});

export const FilesForm = ({
  eventData,
  eventId,
}: FilesFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        visibleName: ""
      }
    });

  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/events/${eventId}/files`, values);
      toast.success("Wydarzenie zaktualizowane");
      setIsEditing(false);
      form.reset()
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

  const { isSubmitting, isValid } = form.formState;

  return (
    <div
      className={cn(
        "mt-6 border rounded-3xl p-6",
        eventData.files.length===0 ? "bg-gray-100" : "bg-green-100"
      )}
    >
          <div className="font-md flex items-center justify-between">
            Pliki
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Dodaj
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
              <AlertDialogTitle>Dodaj pliki</AlertDialogTitle>
              <AlertDialogHeader>Prześlij plik</AlertDialogHeader>
                <Uploader
                  endpoint="eventFile"
                  onChange={(url) => {
                    if (url) {
                      form.setValue("url", url);
                      toast.success("Plik przesłany");
                      setUploadSuccess(true);
                    }
                  }}
                />
                {uploadSuccess && (
                  <div className="mt-2 text-sm text-green-600">
                    Plik dodany
                  </div>
                )} 
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                      control={form.control}
                      name="visibleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa pliku</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              placeholder="np. 'Wyniki Etap 1'"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <AlertDialogFooter className="mt-4">
                      <AlertDialogCancel onClick={() => {
                        form.reset()
                        setUploadSuccess(false)
                        }}>
                        Anuluj
                      </AlertDialogCancel>
                      <AlertDialogAction
                      type="submit" 
                      disabled={!isValid || isSubmitting}
                      >
                         Zatwierdź
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </AlertDialogContent>
            </AlertDialog>
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
                    className="flex items-center p-3 mt-4 w-full bg-green-200  border  rounded-full"
                    >
                        <FileIcon className="h-4 w-4 mr-2 flex-shrink-0 text-green-600"/>
                        <p className="text-xs line-clamp-1 text-green-600">
                            {file.visibleName ? file.visibleName : file.name}
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
                        <FileNameForm
                        eventId={eventId}
                        fileId={file.id}
                        />
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
