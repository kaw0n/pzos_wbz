"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter()

    const handleClick = () => {
        router.push('/')
    }
    return ( 
        <Image
        height={100}
        width={100}
        alt="logo"
        src="/logo2.png"
        onClick={handleClick}
        />
     );
}
 
export default Logo;