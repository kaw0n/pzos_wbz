import Logo from "./Logo";
import MenuRoutes from "./MenuRoutes";

const Menu = () => {
    return ( 
        <div className="
        h-full
        flex 
        flex-col
        md:flex-row 
        overflow-y-auto 
        bg-white ">
            <div className="p-6">
                <Logo/>
            </div>
            <div className="flex flex-col w-full">
                <MenuRoutes/>
            </div>
        </div>
     );
}
 
export default Menu;