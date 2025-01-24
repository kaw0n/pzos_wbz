import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    {params}: {params: { eventId: string, ageCategoryId: string }}
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

        const ageCategory = await db.ageCategory.delete({
            where:{
                eventId: params.eventId,
                id: params.ageCategoryId
            }
        })
        return NextResponse.json(ageCategory)

    }catch(error){
        console.log("[FILEID]", error)
        return new NextResponse("Wewnętrzny błąd serwera", {status:500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params : {eventId: string, ageCategoryId: string}}
) {
    try {
        const { userId} = await auth()
        const {...values} = await req.json()

        if (!userId) {
            return new NextResponse("Brak autoryzacji", {status: 401})
        }

        const ownCourse = await db.event.findUnique({
            where:{
                id: params.eventId,
                userId
            }
        })

        if (!ownCourse) {
            return new NextResponse("Brak autoryzacji", {status: 401})
        }

        const ageCategory = await db.ageCategory.update({
            where:{
                id: params.ageCategoryId,
                eventId: params.eventId
            },
            data:{
                ...values,
            }
        })

        return  NextResponse.json(ageCategory)

    } catch (error){
        console.log("[EVENT_CATEGORY_ID", error)
        return new NextResponse("Wewnętrzny błąd", {status : 500})
    }
}

