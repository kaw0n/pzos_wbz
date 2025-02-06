import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { EventsList } from "../../_components/EventsList";
import ReusableIcon from "@/components/ReusableIcon";
import { Calendar, CalendarCheck, CalendarClock } from "lucide-react";

const Profile = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const enrollments = await db.enroll.findMany({
    where: {
      userId: userId,
    },
    include: {
      event: {
        include: {
          category: true,
          ageCategories: true,
          files: true,
          enrollments: true,
        },
      },
    },
    orderBy: {
      event: {
        date: "asc",
      },
    },
  });

  const uniqueEvents = Array.from(
    new Map(enrollments.map((enrollment) => [enrollment.event.id, enrollment.event])).values()
  );

  const now = new Date();

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(now.getDate() - 3);

  const ongoingEvents = uniqueEvents.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate >= threeDaysAgo && eventDate <= now;
  });

  const upcomingEvents = uniqueEvents.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate > now;
  });

  const pastEvents = uniqueEvents.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate < threeDaysAgo;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Wydarzenia na które jesteś zapisany
      </h1>

      {ongoingEvents.length > 0 && (
        <>
          <div className="flex items-center gap-x-2 mb-4">
            <ReusableIcon icon={Calendar} variant="default" />
            <h2 className="text-xl font-semibold">Wydarzenia w trakcie</h2>
          </div>
          <EventsList items={ongoingEvents} />
          <div className="border-b my-6" />
        </>
      )}

      {upcomingEvents.length > 0 && (
        <>
          <div className="flex items-center gap-x-2 mb-4">
            <ReusableIcon icon={CalendarClock} variant="default" />
            <h2 className="text-xl font-semibold">Nadchodzące wydarzenia</h2>
          </div>
          <EventsList items={upcomingEvents} />
          <div className="border-b my-6" />
        </>
      )}

      {pastEvents.length > 0 && (
        <>
          <div className="flex items-center gap-x-2 mb-4">
            <ReusableIcon icon={CalendarCheck} variant="past" />
            <h2 className="text-xl font-semibold">Odbyte wydarzenia</h2>
          </div>
          <EventsList items={pastEvents} />
        </>
      )}

      {uniqueEvents.length === 0 && (
        <div className="text-gray-500">
          Brak zapisanych wydarzeń
        </div>
      )}
    </div>
  );
};

export default Profile;
