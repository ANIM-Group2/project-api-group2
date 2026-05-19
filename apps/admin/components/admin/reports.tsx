"use client"

import {
  Download,
  DollarSign,
  Package,
  Clock,
  Activity,
  AlertTriangle,
  Gauge,
} from "lucide-react"
import {
  Bar,
  Line,
  LineChart,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  kpis,
  monthlyPerformance,
  topCustomers,
  formatCurrency,
  formatPercent,
} from "@/lib/admin-data"

const revenueVsTargetData = monthlyPerformance.map((m) => ({
  month: m.month,
  actual: m.revenue,
  target: m.target,
}))

const marginTrendData = monthlyPerformance.map((m) => ({
  month: m.month,
  margin: m.margin,
}))

export function ReportsComponent() {
  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Performance Reports</h2>
          <p className="text-sm text-muted-foreground">Comprehensive analytics and KPI summary</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue YTD</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(kpis.revenueYTD)}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpis.activeProductionOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{formatPercent(kpis.onTimeDelivery)}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Yield Rate</CardTitle>
            <Activity className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{formatPercent(kpis.yieldRate)}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{kpis.criticalIncidentsOpen}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Capacity</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatPercent(kpis.capacityUtilization)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Performance Summary</CardTitle>
          <CardDescription>Key metrics by month (Oct 2025 - Feb 2026)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Month</TableHead>
                <TableHead className="text-muted-foreground text-right">Revenue</TableHead>
                <TableHead className="text-muted-foreground text-right">vs Target</TableHead>
                <TableHead className="text-muted-foreground text-right">Yield Rate</TableHead>
                <TableHead className="text-muted-foreground text-right">On-Time Delivery</TableHead>
                <TableHead className="text-muted-foreground text-right">Critical Incidents</TableHead>
                <TableHead className="text-muted-foreground text-right">Gross Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyPerformance.map((month) => {
                const isAboveTarget = month.revenue >= month.target
                const variance = ((month.revenue - month.target) / month.target) * 100
                return (
                  <TableRow key={month.month} className="border-border">
                    <TableCell className="font-medium text-foreground">{month.month} 2026</TableCell>
                    <TableCell className={`text-right font-medium ${isAboveTarget ? "text-emerald-400" : "text-red-400"}`}>
                      {formatCurrency(month.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={isAboveTarget 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                        }
                      >
                        {variance >= 0 ? "+" : ""}{variance.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{month.yield}%</TableCell>
                    <TableCell className={`text-right ${month.otd < 90 ? "text-amber-400" : "text-muted-foreground"}`}>
                      {month.otd}%
                    </TableCell>
                    <TableCell className={`text-right ${month.incidents > 0 ? "text-red-400" : "text-muted-foreground"}`}>
                      {month.incidents}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{month.margin}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts Side by Side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue vs Target */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue vs Target</CardTitle>
            <CardDescription>Monthly revenue performance against targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={revenueVsTargetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Legend />
                <Bar 
                  dataKey="actual" 
                  name="Actual Revenue"
                  fill="hsl(var(--chart-1))" 
                  radius={[4, 4, 0, 0]}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Target"
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gross Margin Trend */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Gross Margin Trend</CardTitle>
            <CardDescription>Monthly gross margin percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={marginTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  domain={[34, 42]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Gross Margin"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="margin" 
                  name="Gross Margin"
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Top Customers by Revenue</CardTitle>
          <CardDescription>Year-to-date revenue and order count by customer</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground w-16">Rank</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground text-right">Revenue YTD</TableHead>
                <TableHead className="text-muted-foreground text-right">Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer) => (
                <TableRow key={customer.name} className="border-border">
                  <TableCell className="font-medium text-foreground">#{customer.rank}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    <span className="mr-2">{customer.flag}</span>
                    {customer.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                      {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatCurrency(customer.revenue)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{customer.orders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
