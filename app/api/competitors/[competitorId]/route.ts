import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    const { id } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isOrganiser = await db.event.findUnique({
        where:{
            id: values.eventId,
            userId: userId
        }
    })

    if(!isOrganiser){
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const competitor = await db.competitor.update({
      where: {
        id,
        event: {
          userId
        }
      },
      data: {
        ...values,
      }
    });

    revalidatePath("/organiser/competitors");

    return NextResponse.json(competitor);
    
  } catch (error) {
    console.log("[COMPETITOR_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { competitorId: string } }
  ) {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        return new NextResponse("Brak autoryzacji", { status: 401 });
      }
  
      
      const competitor = await db.competitor.findUnique({
        where: {
          id: params.competitorId
        },
        include: {
          event: true
        }
      });
  
      if (!competitor) {
        return new NextResponse("Zawodnik nie istnieje", { status: 404 });
      }
  
      
      if (competitor.event.userId !== userId) {
        return new NextResponse("Brak dostępu", { status: 403 });
      }
  
      
      const deletedCompetitor = await db.competitor.delete({
        where: {
          id: params.competitorId
        }
      });

      revalidatePath("/organiser/competitors");
  
      return NextResponse.json(deletedCompetitor);
  
    } catch (error) {
      console.error(error);
      return new NextResponse('Błąd serwera', { status: 500 });
    }
  }