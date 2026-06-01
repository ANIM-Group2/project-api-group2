import { useEffect, useState } from 'react'
import { Euro, TrendingUp, Building2, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { statsApi, ordersApi, type SalesStats, type CustomerOrder, formatCurrency } from '@/lib/api'
import { cn } from '@/lib/utils'

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

export default function Analytics() {
  const [stats,   setStats]   = useState<SalesStats | null>(null)
  const [orders,  setOrders]  = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [s, o] = await Promise.all([statsApi.get(), ordersApi.getAll()])
        setStats(s)
        setOrders(o)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  // Build status breakdown for pie chart from real data
  const statusData = (stats?.orders_by_status ?? []).map((s, i) => ({
    name: s.status.replace('_', ' '),
    value: Number(s.count),
    color: COLORS[i % COLORS.length],
  }))

  const kpiCards = [
    { title: 'Revenue YTD',   value: formatCurrency(Number(stats?.revenue_ytd ?? 0)), icon: Euro,      color: 'text-green-400' },
    { title: 'Revenue MTD',   value: formatCurrency(Number(stats?.revenue_mtd ?? 0)), icon: TrendingUp, color: 'text-blue-400' },
    { title: 'Active Orders', value: stats?.active_orders ?? '—',                      icon: Building2,  color: 'text-purple-400' },
    { title: 'Urgent Orders', value: stats?.urgent_orders ?? '—',                      icon: Clock,      color: 'text-amber-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map(k => {
          const Icon = k.icon
          return (
            <Card key={k.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{k.title}</CardTitle>
                <Icon className={cn('h-5 w-5', k.color)} />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{k.value}</div></CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by status pie */}
        <Card>
          <CardHeader><CardTitle>Orders by Status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                      paddingAngle={2} dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="flex h-full items-center justify-center text-muted-foreground">No data</p>}
            </div>
          </CardContent>
        </Card>

        {/* Top customers */}
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
                {(stats?.top_customers ?? []).map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                        i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        i === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-amber-700/20 text-amber-600')}>
                        {i + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{c.company_name}</TableCell>
                    <TableCell className="text-center">{c.order_count}</TableCell>
                    <TableCell className="text-right font-medium text-green-400">{formatCurrency(Number(c.revenue))}</TableCell>
                  </TableRow>
                ))}
                {(!stats?.top_customers || stats.top_customers.length === 0) && (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders summary */}
      <Card>
        <CardHeader><CardTitle>All Orders Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(stats?.orders_by_status ?? []).map(s => (
              <div key={s.status} className="rounded-lg border bg-muted/30 p-4 text-center">
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">{s.status.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}