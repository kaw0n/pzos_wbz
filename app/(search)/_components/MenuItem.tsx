"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}



const MenuItem = ({
    icon: Icon,
    label,
    href
}: MenuItemProps) => {

    const pathname = usePathname()

    const isActive = 
    (pathname === "/" && href === "/") || pathname === href || pathname?.startsWith(`${href}/`)


    return (
        <Link 
            href={href} 
            passHref
            className={cn(
                'relative flex flex-col gap-x-2 text-slate-500 text-sm font-[500] pl-6 md:pr-6 md:rounded-xl transition-all hover:text-slate-600 hover:bg-slate-300/20',
                isActive && 'text-green-600 bg-green-200/20 hover:bg-green-300/20'
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon size={22} className={cn('text-slate-500', isActive && 'text-green-600')} />
                {label}
            </div>

            <div
                className={cn(
                    'absolute bottom-0 left-0 h-[4px] w-0 bg-green-600 transition-all duration-300',
                    isActive && 'w-full'
                )}
            />
        </Link>
    );
}
 
export default MenuItem;