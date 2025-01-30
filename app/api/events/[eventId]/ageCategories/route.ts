import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    {params} : {params: {eventId: string}}
) {
    try{
        const { userId } = await auth();
        const values = await req.json();

        if(!userId){
            return new NextResponse('Brak autoryzacji', { status: 401 });
        }

        const eventOrganiser = await db.event.findUnique({
            where:{
                id: params.eventId,
                userId: userId
            }
        })

        if(!eventOrganiser){
            return new NextResponse("Brak dostępu", {status: 403})
        }

        const ageCategory = await db.ageCategory.create({
            data: {
                eventId: params.eventId,
                ...values
            }
        })

        return NextResponse.json(ageCategory);

    } catch (error) {
        console.error(error);
        return new NextResponse('Błąd serwera', { status: 500 });
    }
}