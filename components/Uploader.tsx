"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import toast from "react-hot-toast"
import { defaultErrorMap } from "zod"

interface UploaderProps{
    onChange: (url?: string) => void
    endpoint: keyof typeof ourFileRouter
}

const Uploader = ({
    onChange, 
    endpoint
}:UploaderProps) => {
    return(
        <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res)=>{
            onChange(res?.[0].url)
        }}
        onUploadError={(error: Error)=>{
            toast.error(error.message)
        }}
        />

    )
}

export default Uploader