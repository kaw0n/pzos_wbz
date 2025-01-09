import ReusableIcon from "@/components/ReusableIcon";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { GaugeCircle, LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";

const EventIdPage = async({
    params
}:{
    params: {
        eventId: string
    }
}) => {

    const {userId} =  await auth()  

    if(!userId){
        return redirect('/')
    }

    const event = await db.event.findUnique({
        where: {
            id: params.eventId
        }
    })

    if(!event){
        return redirect('/')
    }

    if (event.userId !== userId) {
        return redirect("/");
    }

    const requiredFields = [
        event.title,
        event.description,
        event.imageUrl,
        event.location,
        event.eventDate,
        event.price,
        event.categoryId,

    ];



    const totalFields = requiredFields.length;

    const filledFields = requiredFields.filter(Boolean).length;

    const progressCount = `(${filledFields}/${totalFields})`;

    return ( 
        <div className="p-6">
            <div className="flex items-center">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Edytuj wydarzenie
                    </h1>
                    <span className="text-sm text-slate-700">
                        Wypełnij wszystkie pola {progressCount}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <ReusableIcon icon={GaugeCircle} variant="default"/>
                        <h2 className="text-xl"> 
                            Dostosuj wydarzenie
                        </h2>
                    </div>
                    <TitleForm
                    initialData={event}
                    eventId={event.id}
                    />
                    <DescriptionForm
                    initialData={event}
                    eventId={event.id}
                    />
                </div>
            </div>
        </div>
     );
}
 
export default EventIdPage;