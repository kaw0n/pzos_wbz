"use client";

import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { DoorOpen } from "lucide-react";

const NavbarRoutes = () => {
  const { isSignedIn } = useAuth();

  const pathname = usePathname();

  const isOrganiserPage = pathname?.startsWith("/organiser");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isOrganiserPage ? (
        <Link href="/">
          <Button variant="outline">
            <DoorOpen className="h-4 w-4 mr-2"/>
            Wyjdź
          </Button>
        </Link>
      ):(
        <Link href="/organiser/events">
          <Button variant="outline">
            Tryb Organizatora
          </Button>
        </Link>

      )}
      {isSignedIn ? (
        <UserButton
        afterSwitchSessionUrl="/"
        />
      ) : (
        <Link href="/sign-in">
          <Button className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-300/20">
            Zaloguj się
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NavbarRoutes;
