import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from 'next-themes'
import {
  Plane,
  LayoutDashboard,
  Package,
  ClipboardList,
  Truck,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getActiveAlerts } from '@/lib/logistics-data'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Stock', icon: Package, path: '/stock' },
  { label: 'Reservations', icon: ClipboardList, path: '/reservations' },
  { label: 'Shipments', icon: Truck, path: '/shipments' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/stock': 'Stock Management',
  '/reservations': 'Reservations',
  '/shipments': 'Shipments',
  '/alerts': 'Alerts',
}

function handleLogout() {
  localStorage.removeItem('aeronexis_token')
  localStorage.removeItem('aeronexis_role')
  window.location.href = 'http://localhost:3000'
}

export function LogisticsLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen] = useState(true)
  const activeAlertCount = getActiveAlerts().length

  const currentPageTitle = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex h-full flex-col border-r bg-card transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Plane className="size-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">AERONEXIS</span>
              <span className="text-xs text-muted-foreground">DYNAMICS</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              const showBadge = item.path === '/alerts' && activeAlertCount > 0

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                  {showBadge && (
                    <span className="absolute right-2 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                      {activeAlertCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* User Card */}
        {sidebarOpen && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  CD
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">Claire Dupont</span>
                <span className="truncate text-xs text-muted-foreground">
                  Logistics Manager — Lyon site
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{currentPageTitle}</h1>
            <p className="text-xs text-muted-foreground">
              Logistics Management System
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      CD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-left md:flex">
                    <span className="text-sm font-medium">Claire Dupont</span>
                    <span className="text-xs text-muted-foreground">
                      Logistics Manager
                    </span>
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
