import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth();

    // Read the request body only once
    const data = await req.json();
    const { url } = data;

    if (!userId) {
      return new NextResponse("Brak dostępu", { status: 403 });
    }

    const eventOrganiser = await db.event.findUnique({
      where: {
        id: params.eventId,
        userId: userId,
      },
    });

    if (!eventOrganiser) {
      return new NextResponse("Brak dostępu", { status: 403 });
    }

    const file = await db.file.create({
      data: {
        url,
        name: url.split("/").pop(),
        eventId: params.eventId,
        ...data,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.log(error);
    return new NextResponse("Wewnętrzny błąd", { status: 500 });
  }
}
