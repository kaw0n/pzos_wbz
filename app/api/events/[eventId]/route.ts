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

export async function DELETE(
    req: Request,
    {params }: {params: {eventId: string}}
){
    try {
        const {userId} = await auth();

        if(!userId) {
            return new NextResponse("Brak autoryzacji", {status: 401})
        }

        const course = await db.event.findUnique({
            where:{
                id: params.eventId,
                userId : userId
            }
        });

        if(!course) {
            return new NextResponse("Nie znaleziono", {status : 404})
        }

        const deletedCourse = await db.event.delete({
            where:{
                id: params.eventId
            }
        })

        return NextResponse.json(deletedCourse)



    } catch (error){
        console.log("[COURSE_ID_DELETE", error)
        return new NextResponse("Wewnętrzny błąd", {status: 500})
    }
}
