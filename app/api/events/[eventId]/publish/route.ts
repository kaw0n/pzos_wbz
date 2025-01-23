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

        const event = await db.event.findUnique({
            where:{
                id: params.eventId,
                userId
            }
        });

        if(!event) {
            return new NextResponse("Nie znaleziono", {status : 404})
        }

        if(!event.title || !event.description || !event.imageUrl || !event.categoryId) {
            return new NextResponse("Brakuje wymaganych pól", { status : 401})
        }

        const publicEvent = await db.event.update({
            where:{
                id: params.eventId,
                userId,
            },
            data:{
                isPublic: true,
            }
        })

        return NextResponse.json(publicEvent)

    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error)
        return new NextResponse("Wewnętrzny błąd servera", { status: 500})
    }
}