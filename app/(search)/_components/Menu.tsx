import Logo from "./Logo";
import MenuRoutes from "./MenuRoutes";

const Menu = () => {
    return ( 
        <div className="
        h-full 
        border-r 
        flex 
        flex-col 
        overflow-y-auto 
        bg-white 
        shadow-sm">
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