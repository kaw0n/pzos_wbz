import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const authHandler = async () =>{
    const {userId} = await auth()
    console.log("user Id:", userId)
    if(!userId){
        throw new UploadThingError("Unauthorized")
    }
    return {userId}
}

export const ourFileRouter = {
  eventImage: f({image:{maxFileSize:"4MB", maxFileCount:1}})
    .middleware(() => authHandler())
    .onUploadComplete(()=>{
        console.log("Upload completed for eventImage");
    }),
  eventFile: f(["text","image","pdf"])
    .middleware(() => authHandler())
    .onUploadComplete(()=>{})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
