"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

const isOrganiserPage = () => {
    return ( 
        <div className="p-6">
            <Link href="/organiser/create">
            <Button>
                Nowe wydarzenie
            </Button>
        </Link>
        </div>
        
        
     );
}
 
export default isOrganiserPage;