"use client"

import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Activity,
  Gauge,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  productionMix,
  incidents,
  topCustomers,
  formatCurrency,
  formatPercent,
  getSeverityColor,
  getStatusColor,
} from "@/lib/admin-data"

const criticalIncidents = incidents.filter((i) => i.severity === "critical")

const revenueChartData = monthlyPerformance.map((m) => ({
  month: m.month,
  actual: m.revenue,
  target: m.target,
}))

const otdChartData = monthlyPerformance.map((m) => ({
  month: m.month,
  otd: m.otd,
}))

export function OverviewComponent() {
  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-400">
            2 critical incidents require immediate attention
          </p>
          <p className="text-sm text-red-400/80">
            INC-2026-003 (welding defect, Lyon) and INC-2026-005 (hydraulic leak failure, Lyon)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Revenue */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue YTD</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(kpis.revenueYTD)}</div>
            <p className="text-xs text-muted-foreground">
              vs {formatCurrency(kpis.revenueTarget)} target
            </p>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Production Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpis.activeProductionOrders}</div>
            <p className="text-xs text-muted-foreground">across 2 sites</p>
          </CardContent>
        </Card>

        {/* On-Time Delivery */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-400">{formatPercent(kpis.onTimeDelivery)}</span>
              <TrendingDown className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-xs text-amber-400/80">below 90% target</p>
          </CardContent>
        </Card>

        {/* Yield Rate */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Yield Rate</CardTitle>
            <Activity className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-400">{formatPercent(kpis.yieldRate)}</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-xs text-muted-foreground">first-pass quality</p>
          </CardContent>
        </Card>

        {/* Critical Incidents */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Incidents Open</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{kpis.criticalIncidentsOpen}</div>
            <p className="text-xs text-red-400/80">immediate action required</p>
          </CardContent>
        </Card>

        {/* Capacity */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Capacity Utilization</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatPercent(kpis.capacityUtilization)}</div>
            <p className="text-xs text-muted-foreground">
              Lyon {kpis.lyonCapacity}% · Toulouse {kpis.toulouseCapacity}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Revenue Performance</CardTitle>
          <CardDescription>Monthly revenue vs target (Oct 2025 - Feb 2026)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Revenue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorActual)"
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
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Charts Side by Side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Production Mix */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Production Mix</CardTitle>
            <CardDescription>Revenue distribution by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productionMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {productionMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* OTD Trend */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">On-Time Delivery Trend</CardTitle>
            <CardDescription>Monthly delivery performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={otdChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[85, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "OTD"]}
                />
                <Line
                  type="monotone"
                  dataKey="otd"
                  name="On-Time Delivery"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Two Tables Side by Side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Critical Incidents */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Critical Incidents</CardTitle>
            <CardDescription>Incidents requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Severity</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Site</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalIncidents.map((incident) => (
                  <TableRow key={incident.id} className="border-border">
                    <TableCell className="font-medium text-foreground">{incident.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{incident.site}</TableCell>
                    <TableCell className="text-muted-foreground">{incident.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Top Customers by Revenue</CardTitle>
            <CardDescription>Year-to-date revenue by customer</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-right text-muted-foreground">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.name} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      <span className="mr-2">{customer.flag}</span>
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(customer.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
