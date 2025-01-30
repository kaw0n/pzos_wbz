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

    const enroll = await db.enroll.findUnique({
        where: {
            id: params.enrollId,
            eventId: params.eventId
        },
        include: {
            competitors: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    if (!enroll) {
        return redirect(`/events/${params.eventId}`);
    }

    return (
        <div>
            <DeleteEnroll params={params} />
            EnrolmentId: {enroll.id}
            <AddCompetitorsForm
            enrollData={enroll}
            enrollId={enroll.id} 
            eventId={enroll.eventId} />
            <SaveEnroll 
            enrollData={enroll} 
            enrollId={enroll.id} 
            eventId={enroll.eventId}
            
            
            />
        </div>
    );
}

export default EnrollmentPage;
