"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Definicja interfejsu Params
interface Params {
    eventId: string;
    enrollId: string;
}

// Przekazanie interfejsu do props komponentu
const EnrollmenPage = ({ params }: { params: Params }) => {

    const [deleting, setDeleting] = useState<string | null>(null);

    const { userId } = useAuth();
    const router = useRouter();

    if (!userId) {
        router.push('/');
    }

    if (!params.enrollId) {
        router.push(`/events/${params.eventId}`)
    }

    const handleDelete = async (id: string) => {
        try {
            setDeleting(id)
            await axios.delete(`/api/events/${params.eventId}/enroll/${params.enrollId}`)
            toast.success("Pomyślnie przerwano")
            router.push(`/events/${params.eventId}`)

        } catch (error) {
            console.log(error)
            toast.error("Coś poszło nie tak")
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div>
            <Button
                onClick={() => handleDelete(params.enrollId)}>
                Wyjdź
            </Button>
            EnrolmentId: {params.enrollId}
        </div>
    );
}

export default EnrollmenPage;
