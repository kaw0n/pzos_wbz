import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params }: {params: {eventId: string}}
){
    try{
        const {userId} = await auth()
        
        if(!userId) {
            return new NextResponse("Brak autoryzacji", {status: 401})
        }

        const course = await db.event.findUnique({
            where:{
                id: params.eventId,
                userId
            }
        });

        if(!course) {
            return new NextResponse("Nie znaleziono", {status : 404})
        }

        const unpublicEvent = await db.event.update({
            where:{
                id: params.eventId,
                userId,
            },
            data:{
                isPublic: false,
            }
        })

        return NextResponse.json(unpublicEvent)

    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error)
        return new NextResponse("Wewnętrzny błąd serwera", { status: 500})
    }
}