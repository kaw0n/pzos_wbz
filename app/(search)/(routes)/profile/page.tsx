import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { EventsList } from "../../_components/EventsList";

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
            createdAt: "desc"
        }
    });

    // Ekstrakcja wydarzeń z zapisów
    const events = enrollments.map(enrollment => enrollment.event);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Wydarzenia na które jesteś zapisany</h1>
            {events.length > 0 ? (
                <EventsList items={events} />
            ) : (
                <div className="text-gray-500">
                    Brak zapisanych wydarzeń
                </div>
            )}
        </div>
    );
}

export default Profile;