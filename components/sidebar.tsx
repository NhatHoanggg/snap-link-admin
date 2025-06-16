"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  House,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Shell,
  CreditCard,
  MessageSquareHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/services/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ModeToggle } from "@/components/mode-toggle"

const adminItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: BookOpen,
  },
  {
    title: "Requests",
    href: "/requests",
    icon: Shell,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reviews",
    href: "/reviews",
    icon: MessageSquareHeart ,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getSidebarItems = () => {
    return adminItems;
  };

  const sidebarItems = getSidebarItems();

  return (
    <TooltipProvider>
      <div className={cn(
        "flex h-full flex-col gap-4 border-r bg-background p-4 transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}>
        {/* Logo + Collapse Button */}
        <div className="flex h-14 items-center justify-between px-2">
          <Link 
            href="/home" 
            className={cn(
              "flex items-center gap-2 font-semibold transition-all duration-300",
              isCollapsed ? "justify-center w-full" : ""
            )}
          >
            <Image
              src="/logo.svg"
              alt="SnapLink Logo"
              width={isCollapsed ? 24 : 32}
              height={isCollapsed ? 24 : 32}
              className="transition-all duration-300"
            />
            {!isCollapsed && <span className="text-xl">SnapLink</span>}
          </Link>
      
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapse(true)}
              className="ml-auto h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
      
          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapse(false)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      
        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && item.title}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className={cn(isCollapsed ? "" : "hidden")}>
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      
        {/* User Profile */}
        <div className="mt-auto border-t pt-4">
          <Tooltip>
            <ModeToggle />
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-3 px-2 py-2",
                isCollapsed ? "justify-center" : ""
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.full_name || ""} />
                  <AvatarFallback>
                    {user?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.full_name || "User"}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className={cn(isCollapsed ? "" : "hidden")}>
              <div className="flex flex-col">
                <span className="font-medium">{user?.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "user@example.com"}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => logout()}
                className={cn(
                  "w-full justify-start gap-3 mt-2",
                  isCollapsed && "justify-center"
                )}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && "Đăng xuất"}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={cn(isCollapsed ? "" : "hidden")}>
              Đăng xuất
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
} 