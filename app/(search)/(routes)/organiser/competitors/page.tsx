import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import  {EventsCombobox}  from "./_components/EventsCombobox";

const CompetitorsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const events = await db.event.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      ageCategories: true,
      competitors: {
        include: {
          ageCategory: true
        }
      }
    }
  });

  const serializedEvents = events.map(event => ({
    ...event,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    competitors: event.competitors.map(competitor => ({
      ...competitor,
      createdAt: competitor.createdAt.toISOString(),
      updatedAt: competitor.updatedAt.toISOString(),
      ageCategory: {
        ...competitor.ageCategory,
        createdAt: competitor.ageCategory.createdAt.toISOString(),
        updatedAt: competitor.ageCategory.updatedAt.toISOString(),
      }
    }))
  }));
  //@ts-ignore
  return <EventsCombobox events={serializedEvents} />;
};

export default CompetitorsPage;