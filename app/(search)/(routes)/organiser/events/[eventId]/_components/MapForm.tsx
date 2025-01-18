"use client";

import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useRouter } from "next/navigation";
import { PenLine, PenOff } from "lucide-react";

const parseLocation = (location: unknown): { lat: number; lng: number } => {
  if (typeof location === "string") {
    try {
      const parsed = JSON.parse(location);
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        return { lat: parsed.lat, lng: parsed.lng };
      }
    } catch (error) {
      console.error("Nieprawidłowy format lokalizacji:", location);
    }
  }

  return { lat: 54.5186, lng: 18.5307 };
};

const fetchCoordinatesFromAddress = async (address: string) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: address,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
      }
    );

    const location = response.data[0];
    return { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error("Nie znaleziono lokalizacji.");
  }
};

interface LocationFormProps {
  eventData: { location: unknown };
  eventId: string;
}

const LocationForm = ({ eventData, eventId }: LocationFormProps) => {

  const [address, setAddress] = useState("");
  const [position, setPosition] = useState(
    parseLocation(eventData.location)
  );

  const [isEditing, setIsEditing] = useState(false);

  const editingState = () => setIsEditing((current) => !current);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const mapRef = useRef<L.Map | null>(null);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e: L.LeafletMouseEvent) => {
        if (!isEditing) return;
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
          )
          .then((response) => {
            const formattedAddress = response.data.display_name;
            setAddress(formattedAddress || "");
          })
          .catch(() => {
            toast.error("Nie udało się zaktualizować adresu.");
          });
      },
    });
    return null;
  };

  const handleAddressSearch = async () => {
    try {
      const location = await fetchCoordinatesFromAddress(address);
      setPosition(location);

      if (mapRef.current) {
        mapRef.current.setView([location.lat, location.lng], 12);
      }
    } catch {
      toast.error("Nie znaleziono lokalizacji.");
    }
  };
  

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.patch(`/api/events/${eventId}`, {
        location: JSON.stringify(position),
      });
      toast.success("Wydarzenie zaktualizowane");
      router.refresh();

      if (mapRef.current) {
        mapRef.current.setView([position.lat, position.lng], 12);
        mapRef.current.invalidateSize();
      }
    } catch {
      toast.error("Coś poszło nie tak");
    } finally {
      setIsSubmitting(false);
    }
  };

  //@ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
  });

  return (
    <div
      className={cn(
        "mt-6 border rounded-full p-28",
        eventData.location ? "bg-green-100 " : "bg-gray-100 mt-6"
      )}
    >
      <div className="font-md flex items-center justify-between">
        Lokalizacja
        <Button onClick={editingState} variant="outline" className="rounded-full">
          {isEditing ? (
            <>
              <PenOff className="h-4 w-4 mr-2" />
              Anuluj
            </>
          ) : (
            <>
              <PenLine className="h-4 w-4 mr-2" />
              Edytuj
            </>
          )}
        </Button>
      </div>
      {!eventData.location && (
        <p
          className={cn(
            "text-sm mt-2",
            !eventData.location && "text-slate-500 italic"
          )}
        >
          Brak lokalizacji
        </p>
      )}
      <div className="space-y-4 mt-2">
        {isEditing && (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Wpisz adres"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button onClick={handleAddressSearch}>Znajdź</Button>
          </div>
        )}
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={12}
          className="h-80 w-full"
          //@ts-ignore
          whenReady={(mapEvent: L.LeafletEvent) => {
            mapRef.current = mapEvent.target as L.Map;
            mapRef.current.invalidateSize();
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[position.lat, position.lng]} />
          <MapClickHandler />
        </MapContainer>
        {isEditing && (
          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              Zapisz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationForm;
