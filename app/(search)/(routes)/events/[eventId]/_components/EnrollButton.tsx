"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface EnrollButtonProps{
    eventId: string
}

const EnrollButton = ({
    eventId,
}:EnrollButtonProps) => {

    const router = useRouter();
    const { userId } = useAuth();

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
    return ( 
        <div>
            <Button
            onClick={handleCreateEnrollment}
            >
                Zapisz się
            </Button>
        </div>
     );
}
 
export default EnrollButton;