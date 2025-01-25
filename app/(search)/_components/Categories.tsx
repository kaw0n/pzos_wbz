"use client"

import { Category } from "@prisma/client";
import { 
    MdOutlineDirectionsRun,
    MdDirectionsBike,

} from "react-icons/md";
import { FaSkiingNordic } from "react-icons/fa";
import { FaWheelchairMove } from "react-icons/fa6";
import { IconType } from "react-icons";
import CategoryItem from "./CategoryItem";



interface CategoriesProps {
    items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
    "FootO": MdOutlineDirectionsRun,
    "MTBO": MdDirectionsBike,
    "SkiO": FaSkiingNordic,
    "TrailO": FaWheelchairMove
}

const Categoires = ({
    items
}: CategoriesProps) => {

    


    return ( 
        <div className="flex items-center gap-x-2 justify-center overflow-auto pt-2">
            {items.map((category) => (
                <CategoryItem
                key={category.id}
                label={category.name}
                icon={iconMap[category.name]}
                value={category.id}
                />
            ))}
        </div>
     );
}
 
export default Categoires;