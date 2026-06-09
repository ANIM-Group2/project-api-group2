import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingCart, Clock, AlertTriangle, Activity, Layers, Loader2, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { productionApi, ordersApi, inventoryApi, type ProductionKPIs, type SalesStats, type Incident, type RawMaterial, type MarginByProduct, formatCurrency } from '@/lib/api'
import { cn } from '@/lib/utils'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const statusColors: Record<string, string> = {
  open:          'bg-red-500/20 text-red-400 border-red-500/30',
  investigating: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resolved:      'bg-green-500/20 text-green-400 border-green-500/30',
  closed:        'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function Overview() {
  const [prodKPIs,   setProdKPIs]   = useState<ProductionKPIs | null>(null)
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null)
  const [incidents,  setIncidents]  = useState<Incident[]>([])
  const [margins,    setMargins]    = useState<MarginByProduct[]>([])
  const [lowStock,   setLowStock]   = useState<RawMaterial[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [kpis, stats, inc, stock] = await Promise.all([
          productionApi.getKPIs(),
          ordersApi.getStats(),
          productionApi.getIncidents(),
          inventoryApi.getLowStock(),
        ])
        setProdKPIs(kpis)
        setSalesStats(stats)
        setIncidents(inc)
        setLowStock(stock)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  const criticalOpen = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved' && i.status !== 'closed')
  const ordersByStatus = salesStats?.orders_by_status ?? []

  const kpiCards = [
    { title: 'Revenue YTD',        value: formatCurrency(Number(salesStats?.revenue_ytd ?? 0)),                      icon: DollarSign,    color: 'text-green-400' },
    { title: 'Active Orders',      value: salesStats?.active_orders ?? '—',                                          icon: ShoppingCart,  color: 'text-blue-400' },
    { title: 'Production Orders',  value: prodKPIs?.active_orders ?? '—',                                            icon: Layers,        color: 'text-purple-400' },
    { title: 'Critical Orders',    value: prodKPIs?.critical_orders ?? '—',                                          icon: Clock,         color: 'text-amber-400' },
    { title: 'Open Incidents',     value: incidents.filter(i => i.status === 'open').length,                         icon: AlertTriangle, color: 'text-red-400',    highlight: true },
    { title: 'Low Stock Items',    value: lowStock.length,                                                            icon: Activity,      color: 'text-orange-400', highlight: lowStock.length > 0 },
    { title: 'Yield Rate',         value: prodKPIs?.yield_rate != null ? `${prodKPIs.yield_rate}%` : '0%',            icon: TrendingUp,    color: 'text-teal-400' },
    { title: 'Completion Rate',    value: prodKPIs?.completion_rate != null ? `${prodKPIs.completion_rate}%` : '0%',  icon: CheckCircle2,  color: 'text-green-400' },
    { title: 'Delayed Orders',     value: prodKPIs?.delayed_orders ?? 0,                                               icon: Clock,         color: 'text-red-400',   highlight: (prodKPIs?.delayed_orders ?? 0) > 0 },
    { title: 'Delay Rate',         value: prodKPIs?.delay_rate != null ? `${prodKPIs.delay_rate}%` : '0%',            icon: AlertTriangle, color: 'text-orange-400', highlight: (prodKPIs?.delay_rate ?? 0) > 20 },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map(k => {
          const Icon = k.icon
          return (
            <Card key={k.title} className={k.highlight && Number(k.value) > 0 ? 'border-red-500/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{k.title}</p>
                    <p className={cn('text-2xl font-bold', k.highlight && Number(k.value) > 0 ? 'text-red-400' : k.color)}>{k.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg', k.highlight && Number(k.value) > 0 ? 'bg-red-500/10' : 'bg-primary/10')}>
                    <Icon className={cn('w-5 h-5', k.highlight && Number(k.value) > 0 ? 'text-red-400' : k.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Critical Alert Banner */}
      {criticalOpen.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-400">
            <span className="font-semibold">{criticalOpen.length} critical incident{criticalOpen.length > 1 ? 's' : ''} require immediate attention</span>
            {' — '}{criticalOpen.map(i => i.title).join(' • ')}
          </p>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by Status Pie */}
        <Card>
          <CardHeader><CardTitle>Customer Orders by Status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {ordersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ordersByStatus.map((s, i) => ({ name: s.status.replace('_', ' '), value: Number(s.count), color: COLORS[i % COLORS.length] }))}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                      {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="flex h-full items-center justify-center text-muted-foreground">No data</p>}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader><CardTitle>Top Customers by Revenue</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(salesStats?.top_customers ?? []).map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{c.company_name}</TableCell>
                    <TableCell className="text-center">{c.order_count}</TableCell>
                    <TableCell className="text-right font-medium text-green-400">{formatCurrency(Number(c.revenue))}</TableCell>
                  </TableRow>
                ))}
                {(!salesStats?.top_customers?.length) && (
                  <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">No data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Critical Incidents */}
      <Card>
        <CardHeader><CardTitle>Recent Incidents</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.slice(0, 8).map(inc => (
                <TableRow key={inc.incident_id}>
                  <TableCell className="font-mono text-xs">{inc.incident_id}</TableCell>
                  <TableCell className="max-w-[240px] truncate text-sm" title={inc.title}>{inc.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('capitalize',
                      inc.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      inc.severity === 'high'     ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      inc.severity === 'medium'   ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30')}>
                      {inc.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('capitalize', statusColors[inc.status] ?? '')}>{inc.status}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inc.batch?.batch_number ?? `#${inc.batch_id}`}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{inc.detected_at?.split('T')[0]}</TableCell>
                </TableRow>
              ))}
              {incidents.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">No incidents</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Margin by Product */}
      {margins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Product</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Qty Sold</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {margins.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{m.product_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{m.product_ref}</TableCell>
                    <TableCell className="text-right">{formatCurrency(m.unit_price)}</TableCell>
                    <TableCell className="text-right">{Number(m.total_qty_sold).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-green-400">{formatCurrency(m.total_revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}