"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface EnrollButtonProps {
    eventId: string
    eventDate: Date | string | null
}

const EnrollButton = ({
    eventId,
    eventDate
}: EnrollButtonProps) => {
    const router = useRouter();
    const { userId } = useAuth();
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (eventDate) {
            const eventDateTime = new Date(eventDate).getTime();
            const currentTime = new Date().getTime();
            const timeDifference = eventDateTime - currentTime;
            const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
            setDaysLeft(days);
        }
    }, [eventDate]);

    const handleCreateEnrollment = async () => {
        if (!userId) {
            toast.error("Musisz być zalogowany, aby móc się zapisać.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`/api/events/${eventId}/enroll`, { userId });
            router.push(`/events/${eventId}/enrol/${response.data.id}`);
            toast.success("Sukces!");
        } catch (error) {
            console.error(error);
            toast.error("Coś poszło nie tak");
        } finally {
            setIsLoading(false);
        }
    };

    if (daysLeft !== null && daysLeft <= 6) {
        return null;
    }

    return (
        <div>
            <Button 
                onClick={handleCreateEnrollment}
                variant="outline"
                size="lg"
                disabled={isLoading}
                className="rounded-full text-lg bg-green-200 hover:text-green-600 text-green-600 hover:border hover:border-green-600 hover:bg-green-100 transition relative"
            >
                {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin absolute left-4" />
                )}
                {isLoading ? "Przetwarzanie..." : "Zapisz się"}
            </Button>
        </div>
    );
}

export default EnrollButton;