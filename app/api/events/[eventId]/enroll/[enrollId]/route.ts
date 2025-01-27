import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params} : {params : {eventId: string, enrollId: string}}
) {
    try {
        const { userId} = await auth()
        const {...values} = await req.json()

        if (!userId) {
            return new NextResponse("Brak autoryzacji", {status: 401})
        }

        const ownEnroll = await db.enroll.findUnique({
            where:{
                id: params.eventId,
                userId
            }
        })

        if (!ownEnroll) {
            return new NextResponse("Brak autoryzacji", {status: 401})
        }

        const enroll = await db.enroll.update({
            where:{
                id: params.enrollId,
                eventId: params.eventId
            },
            data:{
                ...values,
            }
        })

        return  NextResponse.json(enroll)

    } catch (error){
        console.log("[EVENT_CATEGORY_ID", error)
        return new NextResponse("Wewnętrzny błąd", {status : 500})
    }
}

export async function DELETE(
    req: Request,
    {params}: {params: { eventId: string, enrollId: string }}
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

        const enroll = await db.enroll.delete({
            where:{
                eventId: params.eventId,
                id: params.enrollId
            }
        })
        return NextResponse.json(enroll)

    }catch(error){
        console.log("[FILEID]", error)
        return new NextResponse("Wewnętrzny błąd serwera", {status:500})
    }
}