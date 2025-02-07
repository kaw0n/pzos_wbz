import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    {params} : {params: {eventId: string, enrollId: string}}
) {
    try{
        const { userId } = await auth();
        const values = await req.json();

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
            },
            include: {
                competitors: {
                    include: {
                        ageCategory: true,
                    }
                }
            }
        })

        if(!ownEnroll){
            return new NextResponse("Brak dostępu", {status: 403})
        }

        
            const existingCompetitor = await db.competitor.findFirst({
                where: {
                    eventId: params.eventId,
                    chip: values.chip,
                },
            });

            if (existingCompetitor) {
                return new NextResponse(
                    "Zawodnik z tym numerem chip już istnieje w tym wydarzeniu",
                    { status: 400 }
                );
            }
        

        const competitor = await db.competitor.create({
            data: {
                enrollId: params.enrollId,
                eventId: params.eventId,
                ...values
            }
        })

        return NextResponse.json(competitor);

    } catch (error) {
        console.error(error);
        return new NextResponse('Błąd serwera', { status: 500 });
    }
}

