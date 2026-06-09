import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAppDispatch, useAuth } from '@/store/hooks'
import { logout } from '@/store/authSlice'
import {
  Plane, ShoppingCart, Building2, BarChart3, CheckSquare,
  Menu, Moon, Sun, ChevronDown, User, LogOut,
} from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/orders':    'Orders',
  '/customers': 'Customers',
  '/analytics': 'Analytics',
  '/approvals': 'Approvals',
  '/profile':   'Profile & Settings',
}

export function SalesLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const [approvalBadge, setApprovalBadge] = useState(0)
  const [isDark, setIsDark]               = useState(() => document.documentElement.classList.contains('dark'))
  const [mobileOpen, setMobileOpen]       = useState(false)

  const navItems = [
    { href: '/orders',    label: 'Orders',    icon: ShoppingCart, badge: undefined as number | undefined },
    { href: '/customers', label: 'Customers', icon: Building2,    badge: undefined as number | undefined },
    { href: '/analytics', label: 'Analytics', icon: BarChart3,    badge: undefined as number | undefined },
    { href: '/approvals', label: 'Approvals', icon: CheckSquare,  badge: approvalBadge > 0 ? approvalBadge : undefined },
  ]

  useEffect(() => {
    async function fetchPending() {
      try {
        const token = localStorage.getItem('aeronexis_token') || ''
        const res = await fetch('http://localhost:4000/api/orders/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setApprovalBadge(Number(data.pending_orders) || 0)
        }
      } catch { /* silent */ }
    }
    fetchPending()
    const interval = setInterval(fetchPending, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  const handleLogout = () => dispatch(logout())
  const displayName  = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Sophie Martin'
  const initials     = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
  const currentTitle = pageTitles[location.pathname] || 'Sales'

  const renderSidebar = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Plane className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-wider text-foreground">AERONEXIS</span>
          <span className="text-xs font-medium tracking-widest text-muted-foreground">DYNAMICS</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(item => {
          const isActive = location.pathname === item.href
          return (
            <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
              className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground">Sales Manager</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-border/50 bg-card lg:flex">
        {renderSidebar()}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">{renderSidebar()}</SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
            </Sheet>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">{currentTitle}</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">Sales Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-xs text-muted-foreground">Sales Manager</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}