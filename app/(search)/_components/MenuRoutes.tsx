"use client"

import { CircleUserRound, Compass } from "lucide-react";
import SidebarItem from "./MenuItem";

const guestRoutes = [
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

const MenuRoutes = () => {

    const routes = guestRoutes
    
    return ( 
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
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