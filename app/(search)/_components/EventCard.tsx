import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Calendar } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  price: number | null;
  date: string;
}

export const EventCard = ({
  id,
  title,
  imageUrl,
  category,
  price,
  date,
}: EventCardProps) => {

  return (
    <Link href={`/events/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-green-600 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs text-slate-500">
            <div className="flex items-center gap-x-1">
              <Calendar size={16} />
              <span>{new Date(date).toLocaleDateString("pl-PL", {timeZone: "Europe/Warsaw"})}</span>
            </div>
          </div>
          <p className="text-md md:text-sm font-medium text-slate-700">
            {price !== null ? formatPrice(price) : "Bezpłatne"}
          </p>
        </div>
      </div>
    </Link>
  );
};
