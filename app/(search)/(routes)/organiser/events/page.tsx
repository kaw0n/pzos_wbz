"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";



const isOrganiserPage = () => {

    const router = useRouter()
    const {userId} =  useAuth()

    const handleCreateEvent = async () => {
        try {
            const response = 
            await axios.post('/api/events', {userId})
            router.push(`/organiser/events/${response.data.id}`)
            toast.success('Wydarzenie zostało utworzone')
        } catch (error) {
            toast.error('Coś poszło nie tak')
        }
    }
    
    return ( 
        <div className="p-6">
            <Button
            onClick={handleCreateEvent}
            >
                Nowe wydarzenie
            </Button>
        </div>
        
        
     );
}
 
export default isOrganiserPage;