"use client"

import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
    label: string;
    icon?: IconType;
    value?: string;
}

const CategoryItem = ({
    label,
    icon: Icon,
    value
}: CategoryItemProps) => {

    const pathname = usePathname()
        const router = useRouter()
        const searchParams = useSearchParams()
    
        const activeCategoryId = searchParams.get("categoryId")
        const activeTitle = searchParams.get("title")
    
        const handleSelect = activeCategoryId === value;
    
        const handleClick = () => {
            const currentParams = qs.parse(searchParams.toString());
            const updatedParams = { ...currentParams, categoryId: handleSelect ? null : value };
            const url = qs.stringifyUrl({ url: pathname, query: updatedParams }, { skipNull: true, skipEmptyString: true });
            router.push(url);
          };

    return ( 
        <button
        onClick={handleClick}
        className={cn(
            "py-2 px-3 text-sm rounded-full border border-slate-200 flex items-center transition gap-x-1 hover:border-green-600 hover:bg-green-100",
            handleSelect && "border-green-600 bg-green-100"
        )}
        typeof="button"
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
     );
}
 
export default CategoryItem;