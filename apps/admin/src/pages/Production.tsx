import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, CheckCircle2, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { productionApi, type ProductionOrder, type ProductionKPIs } from '@/lib/api'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  planned:     'bg-gray-500/20 text-gray-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed:   'bg-green-500/20 text-green-400',
  cancelled:   'bg-red-500/20 text-red-400',
}
const priorityColors: Record<string, string> = {
  low:      'bg-gray-500/20 text-gray-400',
  normal:   'bg-blue-500/20 text-blue-400',
  medium:   'bg-blue-500/20 text-blue-400',
  high:     'bg-amber-500/20 text-amber-400',
  urgent:   'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
}

export default function Production() {
  const [orders,     setOrders]     = useState<ProductionOrder[]>([])
  const [kpis,       setKpis]       = useState<ProductionKPIs | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [siteFilter, setSiteFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    async function load() {
      try {
        const [o, k] = await Promise.all([productionApi.getOrders(), productionApi.getKPIs()])
        setOrders(o)
        setKpis(k)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = orders.filter(o => {
    const matchSite   = siteFilter === 'all'   || (o.site?.name ?? '').toLowerCase().includes(siteFilter.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSite && matchStatus
  })

  // Build yield-by-product data from real orders
  const productYield = Object.values(
    orders.reduce((acc, o) => {
      const ref = o.product?.reference?.split('-')[1] ?? 'Other'
      if (!acc[ref]) acc[ref] = { category: ref, completed: 0, total: 0 }
      acc[ref].total += o.quantity_ordered
      if (o.status === 'completed') acc[ref].completed += o.quantity_ordered
      return acc
    }, {} as Record<string, { category: string; completed: number; total: number }>)
  ).map(d => ({ category: d.category, yield: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0 }))

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Active Orders',   value: kpis?.active_orders ?? '—',    icon: ClipboardList, color: 'text-blue-400',    bg: 'bg-blue-500/10' },
          { title: 'Completed',       value: kpis?.completed_orders ?? '—', icon: CheckCircle2,  color: 'text-green-400',   bg: 'bg-green-500/10' },
          { title: 'Total',           value: kpis?.total_orders ?? '—',     icon: TrendingUp,    color: 'text-purple-400',  bg: 'bg-purple-500/10' },
          { title: 'Critical',        value: kpis?.critical_orders ?? '—',  icon: AlertTriangle, color: 'text-red-400',     bg: 'bg-red-500/10' },
        ].map(k => {
          const Icon = k.icon
          return (
            <Card key={k.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{k.title}</p>
                    <p className={cn('text-2xl font-bold', k.color)}>{k.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg', k.bg)}><Icon className={cn('w-5 h-5', k.color)} /></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Site:</span>
          {['all', 'Lyon', 'Toulouse'].map(s => (
            <Button key={s} variant={siteFilter === s ? 'default' : 'outline'} size="sm"
              onClick={() => setSiteFilter(s)}>
              {s === 'all' ? 'All' : s}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader><CardTitle>Production Orders ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Ref</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.production_order_id}>
                  <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-sm">{o.product?.name ?? '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{o.product?.reference ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.site?.name ?? '—'}</TableCell>
                  <TableCell className="text-sm">{o.quantity_ordered}</TableCell>
                  <TableCell><Badge className={cn('capitalize', statusColors[o.status] ?? '')}>{o.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell><Badge className={cn('capitalize', priorityColors[o.priority] ?? '')}>{o.priority}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.planned_start?.split('T')[0] ?? '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.planned_end?.split('T')[0] ?? '—'}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">No orders found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Completion by Product */}
      {productYield.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Completion Rate by Product Line</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productYield} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" width={60} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(v: number) => [`${v}%`, 'Completion']} />
                  <Bar dataKey="yield" radius={[0, 4, 4, 0]}>
                    {productYield.map((e, i) => (
                      <Cell key={i} fill={e.yield >= 80 ? '#10b981' : e.yield >= 50 ? '#3b82f6' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}