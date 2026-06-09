import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Save, DollarSign, ShoppingCart, Clock, AlertTriangle, Layers, Loader2, CheckCircle2, TrendingUp, FileText } from 'lucide-react'
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { productionApi, ordersApi, inventoryApi, type ProductionKPIs, type SalesStats, formatCurrency } from '@/lib/api'
import { cn } from '@/lib/utils'

const GATEWAY = 'http://localhost:4000'

export default function Reports() {
  const [prodKPIs,   setProdKPIs]   = useState<ProductionKPIs | null>(null)
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null)
  const [lowStock,   setLowStock]   = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [saveMsg,    setSaveMsg]    = useState<string | null>(null)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [k, s, ls] = await Promise.all([
          productionApi.getKPIs(),
          ordersApi.getStats(),
          inventoryApi.getLowStock(),
        ])
        setProdKPIs(k); setSalesStats(s); setLowStock(ls ?? [])
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  function handleExport() {
    // Add print styles and trigger browser print
    const style = document.createElement('style')
    style.id = 'print-style'
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #report-content, #report-content * { visibility: visible; }
        #report-content { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
        @page { margin: 15mm; size: A4; }
        .print-break { page-break-before: always; }
      }
    `
    document.head.appendChild(style)
    window.print()
    setTimeout(() => document.getElementById('print-style')?.remove(), 1000)
  }

  async function handleSaveReport() {
    setSaving(true)
    setSaveMsg(null)
    try {
      const token = localStorage.getItem('aeronexis_token') || ''
      const reportData = {
        report_type: 'global',
        generated_at: new Date().toISOString(),
        period: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        kpis: {
          revenue_ytd:       salesStats?.revenue_ytd,
          revenue_mtd:       salesStats?.revenue_mtd,
          active_orders:     salesStats?.active_orders,
          pending_orders:    salesStats?.pending_orders,
          production_active: prodKPIs?.active_orders,
          critical_orders:   prodKPIs?.critical_orders,
          completion_rate:   prodKPIs?.completion_rate,
          yield_rate:        prodKPIs?.yield_rate,
          delayed_orders:    prodKPIs?.delayed_orders,
          delay_rate:        prodKPIs?.delay_rate,
          low_stock_items:   lowStock.length,
        },
        top_customers:     salesStats?.top_customers ?? [],
        orders_by_status:  salesStats?.orders_by_status ?? [],
      }

      const res = await fetch(`${GATEWAY}/api/traceability/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(reportData),
      })

      if (res.ok) {
        setSaveMsg('Report saved to database successfully')
      } else {
        setSaveMsg('Failed to save report')
      }
    } catch {
      setSaveMsg('Error saving report')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(null), 4000)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  const kpiCards = [
    { title: 'Revenue YTD',       value: formatCurrency(Number(salesStats?.revenue_ytd ?? 0)),  icon: DollarSign,    color: 'text-green-400' },
    { title: 'Revenue MTD',       value: formatCurrency(Number(salesStats?.revenue_mtd ?? 0)),  icon: DollarSign,    color: 'text-blue-400' },
    { title: 'Active Orders',     value: salesStats?.active_orders  ?? '—',                     icon: ShoppingCart,  color: 'text-blue-400' },
    { title: 'Pending Approval',  value: salesStats?.pending_orders ?? '—',                     icon: Clock,         color: 'text-amber-400' },
    { title: 'Production Active', value: prodKPIs?.active_orders    ?? '—',                     icon: Layers,        color: 'text-purple-400' },
    { title: 'Critical Orders',   value: prodKPIs?.critical_orders  ?? '—',                     icon: AlertTriangle, color: 'text-red-400' },
    { title: 'Yield Rate',        value: prodKPIs?.yield_rate != null ? `${prodKPIs.yield_rate}%` : '0%', icon: TrendingUp, color: 'text-teal-400' },
    { title: 'Completion Rate',   value: prodKPIs?.completion_rate != null ? `${prodKPIs.completion_rate}%` : '0%', icon: CheckCircle2, color: 'text-green-400' },
    { title: 'Delayed Orders',    value: prodKPIs?.delayed_orders ?? 0,                         icon: Clock,         color: 'text-orange-400' },
    { title: 'Low Stock Items',   value: lowStock.length,                                        icon: AlertTriangle, color: 'text-red-400' },
  ]

  const statusRows   = salesStats?.orders_by_status ?? []
  const topCustomers = salesStats?.top_customers ?? []
  const chartData    = statusRows.map(s => ({ status: s.status.replace('_', ' '), count: Number(s.count) }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-lg font-semibold">Executive Summary</h2>
          <p className="text-sm text-muted-foreground">Live data — {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          {saveMsg && (
            <span className={cn('text-xs', saveMsg.includes('success') ? 'text-green-400' : 'text-red-400')}>
              {saveMsg}
            </span>
          )}
          {/* <Button variant="outline" className="gap-2" onClick={handleSaveReport} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save to DB
          </Button> */}
          <Button className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Report content — everything below this is printed */}
      <div id="report-content" className="space-y-6">

        {/* Print header */}
        <div className="hidden print:block mb-6 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AERONEXIS DYNAMICS</h1>
              <p className="text-sm text-gray-500">Executive Report — {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Confidential</p>
              <p>Generated by Philippe Laurent</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Key Performance Indicators
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Customer Orders by Status</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
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
                    <TableHead className="text-right">Share</TableHead>
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
                        <TableCell className="text-right">
                          <Badge variant="outline">{pct}%</Badge>
                        </TableCell>
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

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader><CardTitle>Order Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusRows.map(s => {
                  const total = statusRows.reduce((acc, r) => acc + Number(r.count), 0)
                  const pct = total > 0 ? ((Number(s.count) / total) * 100).toFixed(1) : '0'
                  return (
                    <TableRow key={s.status}>
                      <TableCell className="capitalize font-medium">{s.status.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right font-mono">{s.count}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{pct}%</TableCell>
                    </TableRow>
                  )
                })}
                {statusRows.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">No data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Low Stock */}
        {lowStock.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Low Stock Alert ({lowStock.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Threshold</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock.slice(0, 10).map((m: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{m.reference}</TableCell>
                      <TableCell className="text-right font-mono">{m.available_quantity} {m.unit}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{m.safety_threshold} {m.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={m.status === 'critical' ? 'text-red-400 border-red-400/30' : 'text-amber-400 border-amber-400/30'}>
                          {m.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Print footer */}
        <div className="hidden print:block mt-8 border-t pt-4 text-xs text-gray-400 flex justify-between">
          <span>AERONEXIS Dynamics — Confidential</span>
          <span>Generated {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}