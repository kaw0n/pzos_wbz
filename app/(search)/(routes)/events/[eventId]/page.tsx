import { getEventInfo } from "@/actions/getEventInfo";
import { File } from "lucide-react";
import Image from "next/image";
// import Map from "./_components/Map";
import EnrollButton from "./_components/EnrollButton";
import dynamic from "next/dynamic";
const Map = dynamic(() => import('./_components/Map'), { ssr: false });

const parseLocation = (location: unknown): { lat: number; lng: number } => {
    if (typeof location === "string") {
        try {
            const parsed = JSON.parse(location);
            if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
                return { lat: parsed.lat, lng: parsed.lng };
            }
        } catch (error) {
            console.error("Invalid location format:", location);
        }
    }
    return { lat: 54.5186, lng: 18.5307 };
};

const EventPage = async ({
    params
}: {params: {eventId: string, title?: string}}) => {

    const {
        files,
        event
    } = await getEventInfo({
        eventId: params.eventId,
    })

    const location = parseLocation(event?.location);

    


    return ( 
        <div>
            <div className="flex flex-row gap-x-2">
                {/* <Image

                src={event?.imageUrl ?? '/default-image.jpg'} 
                alt={event?.title?? 'Event image'} 
                width={500} height={500}
                /> */}
                <Map center={[location.lat, location.lng]} />

                <h1>{new Date(event?.date ?? '').toLocaleDateString()}</h1>
                
                
            </div>
            <div className="p-4">
            {files.map((file)=>(
                <a 
                href={file.url}
                target="_blank"
                key={file.id} 
                className="flex items-center p-3 w-full bg-green-200 border text-green-600 rounded-md hover:underline"
                >
                    <File/>
                    <p className="line-clamp-1 ">
                        {file.visibleName}
                    </p>
                </a>
            ))}
        </div>
        <EnrollButton
        eventId={params.eventId}
        />
    </div>
     );
}
 
export default EventPage;