import NavbarRoutes from "@/components/NavbarRoutes";
import { MobileMenu } from "./MobileMenu";
import MenuRoutes from "./MenuRoutes";
import Logo from "./Logo";


const Navbar = () => {
    return ( 
        <div className="
        p-4
        h-full
        border-b
        flex
        items-center
        bg-white
        shadow-sm
        ">  
            <div className="hidden md:flex w-[200px] pr-6 pl-6">
                <Logo/>
            </div>
            <div className="hidden md:flex w-full">
                <MenuRoutes/>
            </div>

            <MobileMenu/>
            <NavbarRoutes/>
        </div>
     );
}
 
export default Navbar;