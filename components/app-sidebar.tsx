import { House, LogOut, Users, BookOpen, MessageSquareHeart  } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/services/auth"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
    title: "Reviews",
    href: "/reviews",
    icon: MessageSquareHeart ,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.href}
                      className={pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <div className="flex items-center gap-2 px-2 py-2">
              <ModeToggle />
            </div>

            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || undefined} alt={user?.full_name || ""} />
                <AvatarFallback>
                  {user?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => logout()}
              className="w-full justify-start gap-3 mt-2"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}