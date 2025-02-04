import { Category, Event } from "@prisma/client";
import { db } from "@/lib/db";

type EventWithProps = Event & {
  category: Category | null;
};

type GetEvents = {
  title?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export const getEvents = async ({
  title,
  categoryId,
  startDate,
  endDate,
}: GetEvents): Promise<EventWithProps[]> => {
  try {
    const events = await db.event.findMany({
      where: {
        isPublic: true,
        title: {
          contains: title,
          mode: "insensitive"
        },
        categoryId: categoryId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        category: true,
        competitors: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return events;
  } catch (error) {
    console.error("[GET_EVENTS]", error);
    return [];
  }
};
