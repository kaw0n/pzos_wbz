import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    {params}: {params: { eventId: string, fileId: string }}
) {
    try{
        const {userId} = await auth()
        if(!userId){
            return new NextResponse("Brak autoryzacji", {status:401})
        }

        const eventOrganiser = await db.event.findUnique({
            where:{
                id: params.eventId,
                userId: userId
            }
        })
        if(!eventOrganiser){
            return new NextResponse("Brak autoryzacji", {status:401})
        }

        const file = await db.file.delete({
            where:{
                eventId: params.eventId,
                id: params.fileId
            }
        })
        return NextResponse.json(file)

    }catch(error){
        console.log("[FILEID]", error)
        return new NextResponse("Wewnętrzny błąd serwera", {status:500})
    }
}

