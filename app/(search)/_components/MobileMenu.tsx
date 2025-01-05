import { SquareMenu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import Menu from "./Menu";

export const MobileMenu = () =>{
    return(
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <SquareMenu
            className="text-green-600"/>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <Menu/>
            </SheetContent>
        </Sheet>
        
    )
}