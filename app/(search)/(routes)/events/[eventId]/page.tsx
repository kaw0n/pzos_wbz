import { getEventInfo } from "@/actions/getEventInfo";
import { File } from "lucide-react";
import dynamic from "next/dynamic";
import EnrollButton from "./_components/EnrollButton";

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
      <div className="flex flex-row gap-x-2">
        <Map center={[location.lat, location.lng]} />
        <h1>{new Date(event?.date ?? "").toLocaleDateString()}</h1>
      </div>
      
      <div className="p-4">
        {files.map((file) => (
          <a
            href={file.url}
            target="_blank"
            key={file.id}
            className="flex items-center p-3 w-full bg-green-200 border text-green-600 rounded-md hover:underline"
          >
            <File />
            <p className="line-clamp-1">{file.visibleName}</p>
          </a>
        ))}
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
                        <p className="text-sm font-medium">Imię: {competitor.name}</p>
                        <p className="text-sm">Nazwisko: {competitor.surname}</p>
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

      <EnrollButton 
      eventId={params.eventId}
      eventDate={event.date}
      />
    </div>
  );
};

export default EventPage;