"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";


const OrganiserClientPage = () => {
    const router = useRouter();
    const { userId } = useAuth();

    const handleCreateEvent = async () => {

        if (!userId) {
          toast.error("Musisz być zalogowany, aby tworzyć wydarzenia.");
          return;
        }
    
        try {
          const response = await axios.post("/api/events", { userId });
          router.push(`/organiser/events/${response.data.id}`);
          toast.success("Wydarzenie zostało utworzone");
        } catch (error) {
          console.error(error);
          toast.error("Coś poszło nie tak");
        }
      };
    return ( 
        <div className="ml-6 mt-6">
          <Button onClick={handleCreateEvent}>Nowe wydarzenie</Button>
        </div>
     );
};

export default OrganiserClientPage;
