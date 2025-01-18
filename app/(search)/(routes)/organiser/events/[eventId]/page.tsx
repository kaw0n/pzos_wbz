import ReusableIcon from "@/components/ReusableIcon";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { GaugeCircle, LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import DateForm from "./_components/DateForm";
import  ImageForm  from "./_components/ImageForm";
import dynamic from "next/dynamic";
import CategoryForm from "./_components/CategoryForm";
const MapForm = dynamic(() => import('./_components/MapForm'), { ssr: false });




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
        event.date,
        event.price,
        event.categoryId,
    ];

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    })

    const allFields = requiredFields.length;

    const completedFields = requiredFields.filter(Boolean).length;

    const progressCount = `(${completedFields}/${allFields})`;

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
                    eventData={event}
                    eventId={event.id}
                    />
                    <DescriptionForm
                    eventData={event}
                    eventId={event.id}
                    />
                    <DateForm
                    eventData={event}
                    eventId={event.id}
                    />
                    <MapForm
                    eventData={event}
                    eventId={event.id}
                    />
                    <ImageForm
                    eventData={event}
                    eventId={event.id}
                    />
                    <CategoryForm
                    eventData={event}
                    eventId={event.id}
                    options={categories.map((category)=>({
                        label: category.name,
                        value: category.id
                    }))}
                    />
                </div>
            </div>
        </div>
     );
}
 
export default EventIdPage;