import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const { userId } = await auth();
      const { eventId, ...values } = await req.json();
      console.log("EVENT ID TO : " + eventId);
  
      if (!userId) {
        return new NextResponse('Brak autoryzacji', { status: 401 });
      }
  
      const event = await db.event.findUnique({
        where: { id: eventId },
      });
  
      if (!event) {
        return new NextResponse("Brak dostępu", { status: 403 });
      }
  
      const ownEvent = await db.event.findUnique({
        where: {
          id: eventId,
          userId: userId
        },
        include: {
          competitors: {
            include: {
              ageCategory: true,
            }
          }
        }
      });
  
      if (!ownEvent) {
        return new NextResponse("Brak dostępu", { status: 403 });
      }
  
      const existingCompetitor = await db.competitor.findFirst({
        where: {
          eventId: eventId,
          chip: values.chip
        }
      });
  
      if (existingCompetitor) {
        return new NextResponse("Zawodnik z tym numerem chip już istnieje w tym wydarzeniu", { status: 400 });
      }
  
      const competitor = await db.competitor.create({
        data: {
          eventId: eventId,
          ...values
        }
      });
  
      return NextResponse.json(competitor);
  
    } catch (error) {
      console.error(error);
      return new NextResponse('Błąd serwera', { status: 500 });
    }
  }
  