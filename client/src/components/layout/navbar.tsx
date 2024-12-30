"use client";
import { ChevronsDown, Github, Menu, User, Shield, Music2, Headphones, MusicIcon } from "lucide-react";
import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";
import useUserStore from "@/store/useUserStore";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "features",
    label: "Features",
  },
  {
    href: "testimonials",
    label: "Testimonials",
  },
  {
    href: "leaderboard",
    label: "Leaderboard",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

 const {isAdmin,isLoggedIn} = useUserStore();
 useEffect(() => {
  console.log(`isAdmin: ${isAdmin}`);
  
 }, [isAdmin]);
  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" prefetch={true} className="font-bold text-lg flex items-center">
        <div className="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg p-2 mr-2 border border-secondary">
          <Headphones className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl">
          DevMusic
        </span>
      </Link>

      {/* <!-- Mobile --> */}
      <div className="flex items-center gap-2 lg:hidden">
        {/* Dashboard Buttons for Mobile */}
        {isAdmin && (
          <Button
            asChild
            size="sm"
            variant="destructive"
            className="flex items-center"
          >
            <Link href="/admin-dashboard" prefetch={true}>
              <Shield className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>
          </Button>
        )}
        {isLoggedIn && (
          <Button asChild variant="default" size="sm" className="flex items-center">
            <Link href="/user-dashboard" prefetch={true}>
              <User className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">User Dashboard</span>
            </Link>
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu className="cursor-pointer" />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" prefetch={true} className="flex items-center">
                    <div className="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg p-2 mr-2 border border-secondary">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl">
                      DevMusic
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link href={href} prefetch={true}>{label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} prefetch={true} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right-side controls */}
      <div className="hidden lg:flex items-center space-x-4">
        {isAdmin && (
          <Button
            asChild
            size="sm"
            variant="destructive"
            className="flex items-center space-x-2"
          >
            <Link href="/admin-dashboard" prefetch={true}>
              <Shield className="w-4 h-4 mr-1" />
              <span>Admin Dashboard</span>
            </Link>
          </Button>
        )}
        {isLoggedIn && (
          <Button asChild variant="default" size="sm" className="flex items-center space-x-2">
            <Link href="/user-dashboard" prefetch={true}>
              <User className="w-4 h-4 mr-1" />
              <span>User Dashboard</span>
            </Link>
          </Button>
        )}

        <Button asChild size="sm" variant="ghost">
          <Link href="https://github.com/gautamkumar1" target="_blank">
            <Github className="size-5" />
          </Link>
        </Button>
        <ToggleTheme />
      </div>
    </header>
  );
};
