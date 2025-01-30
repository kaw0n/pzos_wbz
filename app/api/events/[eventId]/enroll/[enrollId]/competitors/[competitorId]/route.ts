import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params} : {params: {eventId: string, enrollId: string, competitorId: string}}
) {
    try{
        const { userId } = await auth();
        const {...values} = await req.json()

        if(!userId){
            return new NextResponse('Brak autoryzacji', { status: 401 });
        }

        const event = await db.event.findUnique({
            where:{
                id: params.eventId,
            }
        })

        if(!event){
            return new NextResponse("Brak dostępu", {status: 403})
        }

        const ownEnroll = await db.enroll.findUnique({
            where: {
                id: params.enrollId,
                userId: userId
            }
        })

        if(!ownEnroll){
            return new NextResponse("Brak dostępu", {status: 403})
        }

        const competitor = await db.competitor.update({
            where:{
                id: params.competitorId,
                enrollId: params.enrollId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(competitor);

    } catch (error) {
        console.error(error);
        return new NextResponse('Błąd serwera', { status: 500 });
    }
}