import NavbarRoutes from "@/components/NavbarRoutes";
import { MobileMenu } from "./MobileMenu";


const Navbar = () => {
    return ( 
        <div className="
        p-4
        border-b
        h-full
        flex
        items-center
        bg-white
        shadow-sm
        ">
            <MobileMenu/>
            <NavbarRoutes/>
        </div>
     );
}
 
export default Navbar;