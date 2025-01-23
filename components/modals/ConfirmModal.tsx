"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger

} from "@/components/ui/alert-dialog"

interface ConfirmModalProps {
    children : React.ReactNode;
    handleConfirm: () => void
}

export const ConfirmModal = ({
    children,
    handleConfirm

}: ConfirmModalProps) => {
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Czy jesteś pewny</AlertDialogTitle>
                    <AlertDialogDescription>
                        To działanie nie może zostać cofnięte
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                    className="rounded-full"
                    >
                        Anuluj
                    </AlertDialogCancel>
                    <AlertDialogAction 
                    onClick={handleConfirm}
                    className="rounded-full bg-green-600 text-white">
                        Kontynuuj
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}