import { LucideIcon } from "lucide-react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils"

const backgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants:{
            variant:{
                default:"bg-green-300",
                past:"bg-slate-400",
            },
            size:{
                default:"p-2",
                sm:"p-1"
            }
        },
        defaultVariants:{
            variant:"default",
            size:"default",
        }
        
    }
)

const iconVariants = cva(
    "",
    {
        variants:{
            variant:{
                default:"text-green-600",
                past:"text-slate-700",
            },
            size:{
                default:"w-8 h-8",
                sm:"w-4 h-4"
            }
        },
        defaultVariants:{
            variant:"default",
            size:"default",
        }
    }
)

type BackgroundVariantProps = VariantProps<typeof backgroundVariants>
type IconVariantProps = VariantProps<typeof iconVariants>

interface ReusableIconProps extends BackgroundVariantProps, IconVariantProps{
    icon: LucideIcon
}

const ReusableIcon = ({
    icon: Icon,
    variant,
    size,
}:ReusableIconProps) => {

        return(
            <div className={cn(backgroundVariants({variant, size}))}>
                <Icon 
                className={cn(iconVariants({variant, size}))}
                />
            </div>
        )

}

export default ReusableIcon