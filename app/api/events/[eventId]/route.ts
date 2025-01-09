import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params: { eventId: string }}
) {
    try{
        const {userId} = await auth()
        const {eventId} = params
        const values = await req.json()

        if(!userId){
            return new NextResponse("Brak autoryzacji", {status:401})
        }

        const event = await db.event.update({
            where:{
                id: eventId,
                userId: userId
            },
            data:{
                ...values
            }
        })
        return NextResponse.json(event)


    }catch(error){
        console.log("[EVENTID]", error)
        return new NextResponse("Wewnętrzny błąd serwera", {status:500})
    }
}
