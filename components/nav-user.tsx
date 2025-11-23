"use client";
import { CreditCard, MoreVertical, LogOut, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";


export function NavUser() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getUserDetails)
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);



  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-10 w-10 rounded-full p-0"
        >
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage
              src={user?.image ?? `https://avatar.vercel.sh/${user?.email}?rounded=60`}
              alt={user?.name}
            />
            <AvatarFallback className="rounded-full">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "CN"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 rounded-lg" 
        align="end" 
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg shrink-0">
              <AvatarImage
                src={user?.image ?? `https://avatar.vercel.sh/${user?.email}?rounded=60`}
                alt={user?.name}
              />
              <AvatarFallback className="rounded-lg">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "CN"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="truncate font-medium text-sm w-full">
                {user?.name ?? user?.email}
              </span>
              <span className="text-muted-foreground truncate text-xs w-full">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <Link href={"/profile"}>
            Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignout} 
          disabled={isLoading}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}