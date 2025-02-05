import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { EventsList } from "../../_components/EventsList";
import ReusableIcon from "@/components/ReusableIcon";
import { Calendar, CalendarCheck } from "lucide-react";

const Profile = async () => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User is not authenticated");
    }

    const enrollments = await db.enroll.findMany({
        where: {
            userId: userId
        },
        include: {
            event: {
                include: {
                    category: true,
                    ageCategories: true,
                    files: true,
                    enrollments: true
                }
            }
        },
        orderBy: {
            event: {
                date: "asc"
            }
        }
    });

    const uniqueEvents = Array.from(new Map(
        enrollments.map(enrollment => [enrollment.event.id, enrollment.event])
    ).values());

    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const incomingEvents = uniqueEvents.filter(event => 
        event.date && new Date(event.date) > sevenDaysAgo
    );

    const pastEvents = uniqueEvents.filter(event => 
        event.date && new Date(event.date) <= sevenDaysAgo
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Wydarzenia na które jesteś zapisany</h1>
            {incomingEvents.length > 0 && (
                <>  
                <div className="flex items-center gap-x-2 mb-4">
                    <ReusableIcon 
                        icon={Calendar} 
                        variant="default"
                    />
                    <h2 className="text-xl font-semibold">
                        Nadchodzące wydarzenia
                    </h2>
                </div>
                <EventsList items={incomingEvents} />
                <div className="border-b my-6" />
            </>
            )}
            {pastEvents.length > 0 && (
                <>
                    <div className="flex items-center gap-x-2 mb-4">
                    <ReusableIcon 
                        icon={CalendarCheck} 
                        variant="past"
                    />
                    <h2 className="text-xl font-semibold">
                        Odbyte wydarzenia 
                    </h2>
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
}

export default Profile;