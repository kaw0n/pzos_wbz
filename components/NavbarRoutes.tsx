"use client";

import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

const NavbarRoutes = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex gap-x-2 ml-auto">
      {isSignedIn ? (
        <UserButton />
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
