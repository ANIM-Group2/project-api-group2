'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  kpiData,
  kpiHistory,
  productionOrders,
  incidents,
  shipments,
  productionByCategory,
} from '@/lib/mock-data'
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Gauge,
  Wrench,
  Package,
  Factory,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

const statusColors = {
  pending: 'bg-muted text-muted-foreground',
  in_progress: 'bg-chart-1/20 text-chart-1',
  quality_check: 'bg-chart-3/20 text-chart-3',
  completed: 'bg-accent/20 text-accent',
  on_hold: 'bg-destructive/20 text-destructive',
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-chart-3/20 text-chart-3',
  high: 'bg-chart-4/20 text-chart-4',
  critical: 'bg-destructive/20 text-destructive',
}

const shipmentStatusColors = {
  scheduled: 'bg-muted text-muted-foreground',
  in_transit: 'bg-chart-1/20 text-chart-1',
  delivered: 'bg-accent/20 text-accent',
  delayed: 'bg-destructive/20 text-destructive',
}

const incidentSeverityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-chart-3/20 text-chart-3',
  high: 'bg-chart-4/20 text-chart-4',
  critical: 'bg-destructive/20 text-destructive',
}

export function DashboardOverview() {
  const activeOrders = productionOrders.filter((o) => o.status === 'in_progress').length
  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length
  const inTransitShipments = shipments.filter((s) => s.status === 'in_transit').length
  const delayedShipments = shipments.filter((s) => s.status === 'delayed').length

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="OEE"
          value={`${kpiData.oee}%`}
          description="Overall Equipment Effectiveness"
          trend={+2.3}
          icon={<Gauge className="h-4 w-4" />}
        />
        <KPICard
          title="Production Yield"
          value={`${kpiData.productionYield}%`}
          description="First-pass quality rate"
          trend={+0.4}
          icon={<Target className="h-4 w-4" />}
        />
        <KPICard
          title="On-Time Delivery"
          value={`${kpiData.onTimeDelivery}%`}
          description="Customer delivery performance"
          trend={+1.2}
          icon={<Truck className="h-4 w-4" />}
        />
        <KPICard
          title="Defect Rate"
          value={`${kpiData.defectRate}%`}
          description="Parts per million defects"
          trend={-0.05}
          trendInverse
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">{activeOrders}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
                <Factory className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">{inTransitShipments}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20">
                <Package className="h-5 w-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Incidents</p>
                <p className="text-2xl font-bold">{openIncidents}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTBF</p>
                <p className="text-2xl font-bold">{kpiData.mtbf}h</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <Wrench className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* OEE Trend Chart */}
        <Card className="lg:col-span-2 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Performance Trends</CardTitle>
            <CardDescription>6-month historical data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiHistory}>
                  <defs>
                    <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
                    domain={[75, 100]}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="oee"
                    stroke="var(--chart-1)"
                    fill="url(#oeeGradient)"
                    strokeWidth={2}
                    name="OEE %"
                  />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="var(--chart-2)"
                    fill="url(#yieldGradient)"
                    strokeWidth={2}
                    name="Yield %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Production by Category */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Production Mix</CardTitle>
            <CardDescription>By product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {productionByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {productionByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="ml-auto font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Production Orders */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Active Production Orders</CardTitle>
            <CardDescription>Current manufacturing status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionOrders
                .filter((o) => o.status !== 'completed')
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                        <Badge className={priorityColors[order.priority]} variant="secondary">
                          {order.priority}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {order.product}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <Progress
                          value={(order.completed / order.quantity) * 100}
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs text-muted-foreground">
                          {order.completed}/{order.quantity}
                        </span>
                      </div>
                    </div>
                    <Badge className={`ml-3 ${statusColors[order.status]}`} variant="secondary">
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Incidents</CardTitle>
            <CardDescription>Quality, safety, and equipment issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.slice(0, 5).map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${incidentSeverityColors[incident.severity]}`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{incident.incidentNumber}</p>
                      <Badge variant="outline" className="text-xs">
                        {incident.type}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium">{incident.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {incident.location} • {incident.reportedDate}
                    </p>
                  </div>
                  <Badge className={incidentSeverityColors[incident.severity]} variant="secondary">
                    {incident.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments Overview */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Logistics Overview</CardTitle>
          <CardDescription>Inbound and outbound shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="rounded-lg border border-border bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className={`h-4 w-4 ${shipment.type === 'inbound' ? 'text-chart-2' : 'text-chart-1'}`} />
                    <span className="font-mono text-sm font-medium">{shipment.shipmentNumber}</span>
                  </div>
                  <Badge className={shipmentStatusColors[shipment.status]} variant="secondary">
                    {shipment.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p className="truncate">
                    <span className="text-foreground">From:</span> {shipment.origin.split(' - ')[0]}
                  </p>
                  <p className="truncate">
                    <span className="text-foreground">To:</span> {shipment.destination.split(' - ')[0]}
                  </p>
                  <p>
                    <span className="text-foreground">ETA:</span> {shipment.estimatedArrival}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {shipment.carrier}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${shipment.priority === 'critical' ? 'border-destructive text-destructive' : ''}`}
                  >
                    {shipment.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KPICard({
  title,
  value,
  description,
  trend,
  trendInverse = false,
  icon,
}: {
  title: string
  value: string
  description: string
  trend: number
  trendInverse?: boolean
  icon: React.ReactNode
}) {
  const isPositive = trendInverse ? trend < 0 : trend > 0

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
            <div
              className={`flex items-center gap-1 text-xs ${isPositive ? 'text-accent' : 'text-destructive'}`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
