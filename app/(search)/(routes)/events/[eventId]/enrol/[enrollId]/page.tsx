import { redirect } from "next/navigation";
import AddCompetitorsForm from "./_components/AddCompetitorsForm";
import { auth } from "@clerk/nextjs/server";
import DeleteEnroll from "./_components/DeleteEnroll";
import { db } from "@/lib/db";
import SaveEnroll from "./_components/SaveEnroll";

interface Params {
    eventId: string;
    enrollId: string;
}

const EnrollmentPage = async ({ params }: { params: Params }) => {

    

    const { userId } = await auth();
    

    if (!userId) {
        return redirect('/');
    }

    if (!params.enrollId) {
        return redirect(`/events/${params.eventId}`)
    }
    const event = await db.event.findUnique({
        where:{
            id: params.eventId
        }
    })
    if(!event){
        return redirect(`/`)
    }

    const enroll = await db.enroll.findUnique({
        where: {
            id: params.enrollId,
            eventId: params.eventId
        },
        include: {
            competitors: {
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    ageCategory: true
                }
            }
        }
    })

    const ageCategories = await db.ageCategory.findMany({
        orderBy: {
            name: "asc",
        },
    })
    

    if (!enroll) {
        return redirect(`/events/${params.eventId}`);
    }

    return (
        <div>
            <div className="p-4 text-3xl justify-between items-center">
                Zapisz się na wydarzenie: {event.title}
            </div>
            <DeleteEnroll params={params} />
            <AddCompetitorsForm
            event={event}
            enrollData={enroll}
            eventId={enroll.eventId}
            enrollId={enroll.id}
            ageCategories={ageCategories
                .filter((category) => category.eventId === enroll.eventId)
                .map((category)=>({
                label: category.name,
                value: category.id,
                eventId: category.eventId
            }))}
            />
            <SaveEnroll 
            enrollId={enroll.id} 
            eventId={enroll.eventId}
            competitors={enroll.competitors}
            />
        </div>
    );
}

export default EnrollmentPage;
