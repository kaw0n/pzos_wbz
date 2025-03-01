"use client"

import { CircleUserRound, Compass, LayoutList, Users } from "lucide-react";
import MenuItem from "./MenuItem";
import { usePathname } from "next/navigation";

const competitorRoutes = [
    {
        icon: Compass,
        label: "Przeglądaj",
        href:"/"
    },
    {
        icon: CircleUserRound,
        label: "Profil",
        href:"/profile"
    },
]

const organiserRoutes = [
    {
        icon: LayoutList,
        label: " Wydarzenia",
        href:"/organiser/events"
    },
    {
        icon: Users,
        label: "Zapisani zawodnicy",
        href:"/organiser/competitors"
    },
]

const MenuRoutes = () => {

    const pathname = usePathname();

    const isOrganiserPage = pathname?.includes("/organiser");

    const routes = isOrganiserPage ? organiserRoutes : competitorRoutes;
    
    return ( 
        <div className="flex flex-col md:flex-row md:items-center w-full md:gap-8">
            {routes.map((route) => (
                <MenuItem
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
                />
            ))}
        </div>
     );
}
 
export default MenuRoutes;