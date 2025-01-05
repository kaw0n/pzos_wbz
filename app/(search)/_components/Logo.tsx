import Image from "next/image";

const Logo = () => {
    return ( 
        <Image
        height={450}
        width={450}
        alt="logo"
        src="/logo.png"
        />
     );
}
 
export default Logo;