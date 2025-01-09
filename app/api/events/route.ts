
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try{
        const { userId } = await auth();
        const {title} = await req.json();

        if(!userId){
            return new NextResponse('Brak autoryzacji', { status: 401 });
        }

        const event  = await db.event.create({
            data: {
                title,
                userId,
            }
        })

        return NextResponse.json(event);

    } catch (error) {
        console.error(error);
        return new NextResponse('Błąd serwera', { status: 500 });
    }
}