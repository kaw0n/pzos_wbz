import { db } from "@/lib/db";
import { Competitor, File } from "@prisma/client";

interface getEventInfoProps {
    eventId: string;
}

export const getEventInfo = async ({
    eventId,
}: getEventInfoProps) => {
    try {
        const event = await db.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                title: true,
                date: true,
                description: true,
                imageUrl: true,
                location: true,
                price: true,
                enrollments: true,
                ageCategories: {
                    include: {
                        competitors: true,
                    },
                },
            },
        });

        if (!event) {
            throw new Error("Wydarzenie nie znalezione");
        }

        const files = await db.file.findMany({
            where: {
                eventId: eventId,
            },
        });

        const competitors = await db.competitor.findMany({
            where: {
                eventId: eventId,
            },include: {
                ageCategory: true,
                
            }
        });

        return {
            files,
            event,
            competitors,
        };
    } catch (error) {
        console.error("[GET_EVENT_INFO]", error);
        return {
            files: [],
            event: null,
            competitors: [],
        };
    }
};
