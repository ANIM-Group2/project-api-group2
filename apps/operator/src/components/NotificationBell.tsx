import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const GATEWAY = 'http://localhost:4000'

interface Notification {
  id: string
  title: string
  message: string
  type: 'critical' | 'warning' | 'info'
  time: string
}

function getToken() { return localStorage.getItem('aeronexis_token') || '' }

async function fetchAdminNotifications(): Promise<Notification[]> {
  const notes: Notification[] = []
  try {
    const [incidents, stock] = await Promise.all([
      fetch(`${GATEWAY}/api/production/incidents?status=open`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
      fetch(`${GATEWAY}/api/inventory/stock/alerts?status=active`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
    ])
    for (const i of (Array.isArray(incidents) ? incidents : []).slice(0, 5)) {
      notes.push({
        id: `inc-${i.incident_id}`,
        title: `${i.severity?.toUpperCase()} Incident`,
        message: i.title || `Batch ${i.batch_id}`,
        type: i.severity === 'critical' ? 'critical' : 'warning',
        time: new Date(i.detected_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }
    for (const a of (Array.isArray(stock) ? stock : []).slice(0, 5)) {
      notes.push({
        id: `stock-${a._id || a.alert_id}`,
        title: 'Low Stock Alert',
        message: a.material?.name || a.message || 'Material below threshold',
        type: 'warning',
        time: new Date(a.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }
  } catch { /* silent */ }
  return notes
}

async function fetchLogisticsNotifications(): Promise<Notification[]> {
  const notes: Notification[] = []
  try {
    const alerts = await fetch(`${GATEWAY}/api/inventory/stock/alerts?status=active`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json())
    for (const a of (Array.isArray(alerts) ? alerts : []).slice(0, 8)) {
      notes.push({
        id: `alert-${a._id || a.alert_id}`,
        title: a.alert_type === 'out_of_stock' ? 'Out of Stock' : 'Low Stock',
        message: a.material?.name || a.message || 'Material below threshold',
        type: a.alert_type === 'out_of_stock' ? 'critical' : 'warning',
        time: new Date(a.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }
  } catch { /* silent */ }
  return notes
}

async function fetchOperatorNotifications(): Promise<Notification[]> {
  const notes: Notification[] = []
  try {
    const incidents = await fetch(`${GATEWAY}/api/production/incidents?status=open`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json())
    for (const i of (Array.isArray(incidents) ? incidents : []).slice(0, 8)) {
      notes.push({
        id: `inc-${i.incident_id}`,
        title: `${i.severity?.toUpperCase()} Incident`,
        message: i.title || `Batch ${i.batch_id}`,
        type: i.severity === 'critical' ? 'critical' : 'warning',
        time: new Date(i.detected_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }
  } catch { /* silent */ }
  return notes
}

async function fetchSalesNotifications(): Promise<Notification[]> {
  const notes: Notification[] = []
  try {
    const orders = await fetch(`${GATEWAY}/api/orders/orders?status=draft`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json())
    for (const o of (Array.isArray(orders) ? orders : []).slice(0, 8)) {
      notes.push({
        id: `order-${o.customer_order_id}`,
        title: 'Pending Approval',
        message: `${o.customer?.company_name || 'Customer'} — €${Number(o.total_amount || 0).toLocaleString()}`,
        type: o.is_urgent ? 'critical' : 'info',
        time: new Date(o.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }
  } catch { /* silent */ }
  return notes
}

const fetchers: Record<string, () => Promise<Notification[]>> = {
  admin:     fetchAdminNotifications,
  logistics: fetchLogisticsNotifications,
  operator:  fetchOperatorNotifications,
  sales:     fetchSalesNotifications,
}

export function NotificationBell({ role }: { role: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen]     = useState(false)
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetcher = fetchers[role] || fetchAdminNotifications
    function load() {
      fetcher().then(n => {
        setNotifications(n)
        setUnread(n.length)
      })
    }
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [role])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const typeColors = {
    critical: 'text-red-400',
    warning:  'text-amber-400',
    info:     'text-blue-400',
  }
  const typeDot = {
    critical: 'bg-red-500',
    warning:  'bg-amber-500',
    info:     'bg-blue-500',
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); setUnread(0) }}
        className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <span className="text-xs text-muted-foreground">{notifications.length} active</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} className="flex gap-3 border-b border-border/50 px-4 py-3 hover:bg-muted/30 transition-colors last:border-0">
                <div className={cn('mt-1.5 h-2 w-2 flex-shrink-0 rounded-full', typeDot[n.type])} />
                <div className="min-w-0">
                  <p className={cn('text-xs font-semibold', typeColors[n.type])}>{n.title}</p>
                  <p className="text-sm text-foreground truncate">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}