import { getEventInfo } from "@/actions/getEventInfo";
import { File, MapPinned } from "lucide-react";
import dynamic from "next/dynamic";
import EnrollButton from "./_components/EnrollButton";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Map = dynamic(() => import("./_components/Map"), { ssr: false });

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

const EventPage = async ({ params }: { params: { eventId: string; title?: string } }) => {
  const { files, event } = await getEventInfo({
    eventId: params.eventId,
  });

  const location = parseLocation(event?.location);

  if (!event) {
    return <div>Wydarzenie nie znalezione</div>;
  }

  return (
    <div>
      <div className="flex justify-center items-center text-3xl text-slate-900 font-semibold p-10 mx-auto max-w-7xl">
        {event.title}
      </div>
      <div className="mt-2 m-6 flex flex-col gap-y-6 md:flex-row md:gap-x-6">
        <div className="border rounded-3xl p-6 bg-gray-100 h-full w-full flex flex-col">
          <div className="text-lg mb-4 items-center flex gap-x-2">
            <MapPinned size={16}/>
            Lokalizacja
          </div>
          <div className="flex h-full">
            <Map center={[location.lat, location.lng]} />
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center p-2 bg-green-200 text-green-600 rounded-full hover:border hover:border-green-600 hover:bg-green-100 transition"
          >
            <MapPinned size={16} className="mr-2"/>
            <span>Nawiguj</span>
          </a>
        </div>
        <div className=" border rounded-3xl p-6 bg-gray-100 w-full">
          <div className="flex items-center gap-x-2 mb-4">
            <Calendar size={16} />
            {new Date(event?.date ?? "").toLocaleDateString("pl-PL", {timeZone: "Europe/Warsaw"})}
          </div>
          <Separator className="mt-5 mb-5"/>
          <p>{event?.description}</p>
          <Separator className="mt-5 mb-5"/>
          <div className="p-2 w-full flex flex-col gap-y-2">
            {files.map((file) => (
              <a
                href={file.url}
                target="_blank"
                key={file.id}
                className="flex items-center p-2 w-full bg-green-200 border text-green-600 rounded-full hover:underline "
              >
                <File size={16} className="mr-2"/>
                <p className="line-clamp-1">{file.visibleName}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center p-4">
      <EnrollButton 
        eventId={params.eventId}
        eventDate={event.date}
        />
      </div>
      

      {event?.ageCategories?.length > 0 && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Kategorie wiekowe i zawodnicy:</h2>
          <ul className="space-y-4">
            {event.ageCategories.map((ageCategory) => (
              <li key={ageCategory.id} className="p-3 bg-gray-100 border rounded-md shadow-sm">
                <h3 className="text-lg font-semibold">{ageCategory.name}</h3>
                {ageCategory.competitors.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {ageCategory.competitors.map((competitor) => (
                      <li key={competitor.id} className="p-2 bg-white border rounded-md">
                        <p className="text-sm font-medium">Imię i nazwizko: {competitor.name} {competitor.surname}</p>
                        <p className="text-sm">Chip: {competitor.chip}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Brak zawodników w tej kategorii.</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventPage;