import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Loader2, Package, Truck, Factory } from 'lucide-react'
import { cn } from '@/lib/utils'

const GATEWAY = 'http://localhost:4000'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'delivery' | 'shipment' | 'production_start' | 'production_end'
  status: string
  site_id?: number
  extra?: string
}

const TYPE_CONFIG = {
  delivery:        { color: 'bg-blue-500',   label: 'Delivery',    icon: Package },
  shipment:        { color: 'bg-green-500',  label: 'Shipment',    icon: Truck },
  production_start:{ color: 'bg-amber-500',  label: 'Prod. Start', icon: Factory },
  production_end:  { color: 'bg-purple-500', label: 'Prod. End',   icon: Factory },
}

const SITE_NAMES: Record<number, string> = { 1: 'Lyon', 2: 'Toulouse' }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function getToken() { return localStorage.getItem('aeronexis_token') || '' }

async function get(path: string) {
  const res = await fetch(`${GATEWAY}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.ok ? res.json() : []
}

export default function Calendar() {
  const today = new Date()
  const [year,  setYear]   = useState(today.getFullYear())
  const [month, setMonth]  = useState(today.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [siteFilter, setSiteFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [orders, shipments, prodOrders] = await Promise.all([
          get('/api/orders/orders'),
          get('/api/orders/shipments'),
          get('/api/production/orders'),
        ])

        const ev: CalendarEvent[] = []

        // Customer order delivery deadlines
        for (const o of orders || []) {
          if (o.expected_delivery) {
            ev.push({
              id:     `delivery-${o.customer_order_id}`,
              title:  o.customer?.company_name || `Order #${o.customer_order_id}`,
              date:   o.expected_delivery,
              type:   'delivery',
              status: o.status,
              extra:  `${o.status} — €${Number(o.total_amount || 0).toLocaleString()}`,
            })
          }
        }

        // Shipment dates
        for (const s of shipments || []) {
          if (s.shipment_date) {
            ev.push({
              id:      `shipment-${s.shipment_id}`,
              title:   s.order?.customer?.company_name || `Shipment #${s.shipment_id}`,
              date:    s.shipment_date,
              type:    'shipment',
              status:  s.status,
              site_id: s.site_id,
              extra:   `${s.status}${s.tracking_number ? ` — ${s.tracking_number}` : ''}`,
            })
          }
        }

        // Production order planned dates
        for (const p of prodOrders || []) {
          if (p.planned_start) {
            ev.push({
              id:      `prod-start-${p.production_order_id}`,
              title:   p.title || `Order #${p.production_order_id}`,
              date:    p.planned_start.split('T')[0],
              type:    'production_start',
              status:  p.status,
              site_id: p.site_id,
              extra:   `Start — ${SITE_NAMES[p.site_id] || `Site ${p.site_id}`}`,
            })
          }
          if (p.planned_end) {
            ev.push({
              id:      `prod-end-${p.production_order_id}`,
              title:   p.title || `Order #${p.production_order_id}`,
              date:    p.planned_end.split('T')[0],
              type:    'production_end',
              status:  p.status,
              site_id: p.site_id,
              extra:   `End — ${SITE_NAMES[p.site_id] || `Site ${p.site_id}`}`,
            })
          }
        }

        setEvents(ev)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7 // Monday = 0
  const totalDays = lastDay.getDate()
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function eventsForDay(day: number): CalendarEvent[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => {
      if (e.date !== dateStr) return false
      if (siteFilter !== 'all' && e.site_id && String(e.site_id) !== siteFilter) return false
      if (typeFilter !== 'all' && e.type !== typeFilter) return false
      return true
    })
  }

  const selectedEvents = selected
    ? events.filter(e => {
        if (e.date !== selected) return false
        if (siteFilter !== 'all' && e.site_id && String(e.site_id) !== siteFilter) return false
        if (typeFilter !== 'all' && e.type !== typeFilter) return false
        return true
      })
    : []

  const isToday = (day: number) => {
    const t = new Date()
    return day === t.getDate() && month === t.getMonth() && year === t.getFullYear()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Delivery Calendar</h2>
          <p className="text-sm text-muted-foreground mt-1">Deliveries, shipments and production schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sites</SelectItem>
              <SelectItem value="1">Lyon</SelectItem>
              <SelectItem value="2">Toulouse</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="delivery">Deliveries</SelectItem>
              <SelectItem value="shipment">Shipments</SelectItem>
              <SelectItem value="production_start">Production starts</SelectItem>
              <SelectItem value="production_end">Production ends</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={cn('h-2.5 w-2.5 rounded-full', cfg.color)} />
            {cfg.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <CardTitle className="text-base">{MONTHS[month]} {year}</CardTitle>
                <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                  {DAYS.map(d => (
                    <div key={d} className="bg-muted/50 text-center text-xs font-medium text-muted-foreground py-2">
                      {d}
                    </div>
                  ))}
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} className="bg-card min-h-16" />
                    const dayEvents = eventsForDay(day)
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const isSelected = selected === dateStr
                    return (
                      <div key={i}
                        onClick={() => setSelected(isSelected ? null : dateStr)}
                        className={cn(
                          'bg-card min-h-16 p-1 cursor-pointer transition-colors hover:bg-muted/50',
                          isSelected && 'ring-2 ring-primary ring-inset'
                        )}>
                        <span className={cn(
                          'text-xs font-medium flex h-5 w-5 items-center justify-center rounded-full',
                          isToday(day) ? 'bg-primary text-primary-foreground' : 'text-foreground'
                        )}>
                          {day}
                        </span>
                        <div className="mt-0.5 space-y-0.5">
                          {dayEvents.slice(0, 3).map(e => (
                            <div key={e.id}
                              className={cn('h-1.5 rounded-full', TYPE_CONFIG[e.type].color)}
                              title={e.title}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Day detail panel */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {selected
                  ? new Date(selected + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
                  : 'Select a day'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selected ? (
                <p className="text-sm text-muted-foreground">Click on a day to see its events.</p>
              ) : selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events on this day.</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map(e => {
                    const cfg = TYPE_CONFIG[e.type]
                    const Icon = cfg.icon
                    return (
                      <div key={e.id} className="flex gap-3 rounded-lg border border-border p-3">
                        <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full', cfg.color + '/20')}>
                          <Icon className={cn('h-4 w-4', cfg.color.replace('bg-', 'text-'))} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{e.title}</p>
                          <p className="text-xs text-muted-foreground">{cfg.label}</p>
                          {e.extra && <p className="text-xs text-muted-foreground mt-0.5">{e.extra}</p>}
                          <Badge variant="outline" className="mt-1 text-xs capitalize">{e.status}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}