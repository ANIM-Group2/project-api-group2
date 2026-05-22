import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Plane,
  LayoutDashboard,
  ClipboardList,
  Layers,
  AlertTriangle,
  History,
  ChevronDown,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getOpenIncidentsCount } from '@/lib/mock-data'

interface OperatorLayoutProps {
  children: ReactNode
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Manufacturing Orders', icon: ClipboardList, path: '/orders' },
  { label: 'Batches', icon: Layers, path: '/batches' },
  { label: 'Incidents', icon: AlertTriangle, path: '/incidents', showBadge: true },
  { label: 'History', icon: History, path: '/history' },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/orders': 'Manufacturing Orders',
  '/batches': 'Batches',
  '/incidents': 'Incidents',
  '/history': 'History',
}

export function OperatorLayout({ children }: OperatorLayoutProps) {
  const location = useLocation()
  const openIncidents = getOpenIncidentsCount()

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = 'http://localhost:3000'
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
          <Plane className="h-6 w-6 text-primary" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sidebar-foreground">AERONEXIS</span>
            <span className="text-xs text-muted-foreground">DYNAMICS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', item.showBadge && openIncidents > 0 && 'text-destructive')} />
                <span className="flex-1">{item.label}</span>
                {item.showBadge && openIncidents > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
                    {openIncidents}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              KA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">Karim Aït-Ouali</span>
              <span className="text-xs text-muted-foreground">Operator — Toulouse site</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              {pageTitles[location.pathname] || 'Dashboard'}
            </h1>
            <span className="text-xs text-muted-foreground">Production Management System</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle (placeholder - always dark) */}
            <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Sun className="h-4 w-4 hidden" />
              <Moon className="h-4 w-4" />
            </button>

            {/* User Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  KA
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-start">
                  <span className="text-sm font-medium">Karim Aït-Ouali</span>
                  <span className="text-xs text-muted-foreground">Operator</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-md border border-border bg-popover py-1 shadow-lg group-hover:block">
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
