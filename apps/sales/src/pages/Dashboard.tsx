import { useEffect, useState } from 'react'
import { ShoppingCart, Euro, AlertTriangle, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ordersApi, statsApi, type CustomerOrder, type SalesStats, formatCurrency, formatDate } from '@/lib/api'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft:         'bg-gray-500/20 text-gray-300 border-gray-500/30',
  confirmed:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_production: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  shipped:       'bg-amber-500/20 text-amber-300 border-amber-500/30',
  delivered:     'bg-green-500/20 text-green-300 border-green-500/30',
  cancelled:     'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function Dashboard() {
  const [stats,   setStats]   = useState<SalesStats | null>(null)
  const [orders,  setOrders]  = useState<CustomerOrder[]>([])
  const [pending, setPending] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [statsData, allOrders] = await Promise.all([
          statsApi.get(),
          ordersApi.getAll(),
        ])
        setStats(statsData)
        setOrders(allOrders.slice(0, 5))
        setPending(allOrders.filter(o => o.status === 'draft').slice(0, 3))
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

  const kpis = [
    { title: 'Active Orders',     value: stats?.active_orders ?? '—',             icon: ShoppingCart, color: 'text-blue-400' },
    { title: 'Revenue MTD',       value: formatCurrency(Number(stats?.revenue_mtd ?? 0)), icon: Euro, color: 'text-green-400' },
    { title: 'Pending Approvals', value: stats?.pending_orders ?? '—',             icon: AlertTriangle, color: 'text-red-400', highlight: true },
    { title: 'Urgent Orders',     value: stats?.urgent_orders ?? '—',              icon: Clock, color: 'text-amber-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(k => {
          const Icon = k.icon
          return (
            <Card key={k.title} className={k.highlight && Number(k.value) > 0 ? 'border-red-500/50' : ''}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{k.title}</CardTitle>
                <Icon className={cn('h-5 w-5', k.color)} />
              </CardHeader>
              <CardContent>
                <div className={cn('text-2xl font-bold', k.highlight && Number(k.value) > 0 && 'text-red-400')}>{k.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {pending.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
              <div>
                <h3 className="font-semibold text-amber-300">Orders pending approval</h3>
                <div className="mt-2 space-y-1">
                  {pending.map(o => (
                    <p key={o.customer_order_id} className="text-sm text-muted-foreground">
                      #{o.customer_order_id} — {o.customer?.company_name ?? 'Customer'} — {formatCurrency(o.total_amount)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(o => (
                  <TableRow key={o.customer_order_id}>
                    <TableCell className="font-mono text-sm">#{o.customer_order_id}</TableCell>
                    <TableCell>{o.customer?.company_name ?? '—'}</TableCell>
                    <TableCell>{formatDate(o.expected_delivery)}</TableCell>
                    <TableCell className="text-right font-medium text-green-400">{formatCurrency(o.total_amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[o.status] ?? ''}>{o.status.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{o.is_urgent ? <span className="text-red-400 text-xs font-medium">URGENT</span> : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {stats?.top_customers && stats.top_customers.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Top Customers by Revenue (YTD)</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-center">Orders</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.top_customers.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{c.company_name}</TableCell>
                      <TableCell className="text-center">{c.order_count}</TableCell>
                      <TableCell className="text-right font-medium text-green-400">{formatCurrency(Number(c.revenue))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}