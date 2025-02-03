"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

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

        try {
            const response = await axios.post(`/api/events/${eventId}/enroll`, { userId });
            router.push(`/events/${eventId}/enrol/${response.data.id}`);
            toast.success("Sukces!");
        } catch (error) {
            console.error(error);
            toast.error("Coś poszło nie tak");
        }
    };

    if (daysLeft !== null && daysLeft <= 6) {
        return null;
    }

    return (
        <div>
            <Button onClick={handleCreateEnrollment}>
                Zapisz się
            </Button>
        </div>
    );
}

export default EnrollButton;