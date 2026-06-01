import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, DollarSign, ShoppingCart, Clock, AlertTriangle, Layers, Loader2 } from 'lucide-react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { productionApi, ordersApi, type ProductionKPIs, type SalesStats, formatCurrency } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function Reports() {
  const [prodKPIs,   setProdKPIs]   = useState<ProductionKPIs | null>(null)
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [k, s] = await Promise.all([productionApi.getKPIs(), ordersApi.getStats()])
        setProdKPIs(k)
        setSalesStats(s)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  const kpiCards = [
    { title: 'Revenue YTD',       value: formatCurrency(Number(salesStats?.revenue_ytd ?? 0)),  icon: DollarSign,    color: 'text-green-400' },
    { title: 'Revenue MTD',       value: formatCurrency(Number(salesStats?.revenue_mtd ?? 0)),  icon: DollarSign,    color: 'text-blue-400' },
    { title: 'Active Orders',     value: salesStats?.active_orders  ?? '—',                     icon: ShoppingCart,  color: 'text-blue-400' },
    { title: 'Pending Approval',  value: salesStats?.pending_orders ?? '—',                     icon: Clock,         color: 'text-amber-400' },
    { title: 'Production Active', value: prodKPIs?.active_orders    ?? '—',                     icon: Layers,        color: 'text-purple-400' },
    { title: 'Critical Orders',   value: prodKPIs?.critical_orders  ?? '—',                     icon: AlertTriangle, color: 'text-red-400' },
  ]

  // Build order status table from real data
  const statusRows = salesStats?.orders_by_status ?? []

  // Customer revenue table
  const topCustomers = salesStats?.top_customers ?? []

  // Chart data from orders_by_status
  const chartData = statusRows.map(s => ({
    status: s.status.replace('_', ' '),
    count: Number(s.count),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Executive Summary</h2>
          <p className="text-sm text-muted-foreground">Live data — {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
        <Button className="gap-2" onClick={() => window.print()}>
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map(k => {
          const Icon = k.icon
          return (
            <Card key={k.title}>
              <CardContent className="p-4 text-center">
                <Icon className={cn('w-5 h-5 mx-auto mb-2', k.color)} />
                <p className="text-xs text-muted-foreground mb-1">{k.title}</p>
                <p className="text-lg font-bold">{k.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by status bar chart */}
        <Card>
          <CardHeader><CardTitle>Customer Orders by Status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
                  </ComposedChart>
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
                  <TableHead>Rank</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((c, i) => {
                  const total = topCustomers.reduce((s, x) => s + Number(x.revenue), 0)
                  const pct   = total > 0 ? ((Number(c.revenue) / total) * 100).toFixed(1) : '0'
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{c.company_name}</TableCell>
                      <TableCell className="text-center">{c.order_count}</TableCell>
                      <TableCell className="text-right font-mono text-green-400">{formatCurrency(Number(c.revenue))}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{pct}%</TableCell>
                    </TableRow>
                  )
                })}
                {topCustomers.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Orders status summary table */}
      <Card>
        <CardHeader><CardTitle>Order Status Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusRows.map(s => (
                <TableRow key={s.status}>
                  <TableCell className="capitalize font-medium">{s.status.replace('_', ' ')}</TableCell>
                  <TableCell className="text-right font-mono">{s.count}</TableCell>
                </TableRow>
              ))}
              {statusRows.length === 0 && (
                <TableRow><TableCell colSpan={2} className="py-6 text-center text-muted-foreground">No data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}