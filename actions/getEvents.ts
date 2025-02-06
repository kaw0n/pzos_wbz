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
          mode: "insensitive",
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
        date: "asc",
      },
    });

    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(threshold.getDate() - 3);

    const sortedEvents = events.sort((a, b) => {
      const aOld = a.date ? new Date(a.date) < threshold : false;
      const bOld = b.date ? new Date(b.date) < threshold : false;

      if (aOld && !bOld) return 1;
      if (!aOld && bOld) return -1;

      return (a.date ? new Date(a.date).getTime() : 0) - (b.date ? new Date(b.date).getTime() : 0);
    });

    return sortedEvents;
  } catch (error) {
    console.error("[GET_EVENTS]", error);
    return [];
  }
};
