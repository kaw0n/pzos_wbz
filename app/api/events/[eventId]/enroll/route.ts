import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    {params} : {params: {eventId: string}}
) {
    try{
        const { userId } = await auth();

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

        const enroll = await db.enroll.create({
            data: {
                eventId: params.eventId,
                userId: userId
            }
        })

        return NextResponse.json(enroll);

    } catch (error) {
        console.error(error);
        return new NextResponse('Błąd serwera', { status: 500 });
    }
}