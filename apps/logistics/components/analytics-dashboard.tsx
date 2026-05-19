'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { kpiData, kpiHistory, productionByCategory, inventoryTrend } from '@/lib/mock-data'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Gauge,
  Truck,
  Package,
  Wrench,
} from 'lucide-react'

const radarData = [
  { metric: 'OEE', value: kpiData.oee, fullMark: 100 },
  { metric: 'Yield', value: kpiData.productionYield, fullMark: 100 },
  { metric: 'OTD', value: kpiData.onTimeDelivery, fullMark: 100 },
  { metric: 'Capacity', value: kpiData.capacityUtilization, fullMark: 100 },
  { metric: 'Quality', value: 100 - kpiData.defectRate, fullMark: 100 },
]

const defectTrend = kpiHistory.map((h) => ({
  month: h.month,
  defects: h.defectRate * 100,
  target: 100,
}))

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Overall Equipment Effectiveness"
          value={`${kpiData.oee}%`}
          change={2.3}
          icon={<Gauge className="h-5 w-5" />}
          description="Target: 85%"
        />
        <KPICard
          title="Production Yield"
          value={`${kpiData.productionYield}%`}
          change={0.4}
          icon={<Target className="h-5 w-5" />}
          description="First-pass quality"
        />
        <KPICard
          title="Inventory Turnover"
          value={kpiData.inventoryTurnover.toFixed(1)}
          change={0.3}
          icon={<Package className="h-5 w-5" />}
          description="Times per year"
        />
        <KPICard
          title="MTTR"
          value={`${kpiData.mttr}h`}
          change={-0.5}
          inverse
          icon={<Wrench className="h-5 w-5" />}
          description="Mean Time To Repair"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance Radar */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Performance Overview</CardTitle>
            <CardDescription>Key metrics comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* OEE Trend */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">OEE Trend Analysis</CardTitle>
            <CardDescription>6-month equipment effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiHistory}>
                  <defs>
                    <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
                    domain={[75, 90]}
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
                    fill="url(#oeeGrad)"
                    strokeWidth={2}
                    name="OEE %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Yield vs OTD */}
        <Card className="lg:col-span-2 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Yield vs On-Time Delivery</CardTitle>
            <CardDescription>Quality and delivery performance correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
                    domain={[85, 100]}
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
                  <Line
                    type="monotone"
                    dataKey="yield"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-2)', r: 4 }}
                    name="Yield %"
                  />
                  <Line
                    type="monotone"
                    dataKey="otd"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-1)', r: 4 }}
                    name="On-Time Delivery %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Production Mix */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Production Mix</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
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
            <div className="mt-2 grid grid-cols-2 gap-1">
              {productionByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-muted-foreground truncate">{cat.name}</span>
                  <span className="ml-auto font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Defect Rate Trend */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Defect Rate Trend</CardTitle>
            <CardDescription>Parts per hundred (lower is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defectTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
                    domain={[0, 150]}
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
                  <Bar dataKey="defects" fill="var(--chart-4)" radius={[4, 4, 0, 0]} name="Defects" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Levels */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Inventory Levels</CardTitle>
            <CardDescription>Value in millions USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inventoryTrend}>
                  <defs>
                    <linearGradient id="rawGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
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
                    dataKey="rawMaterials"
                    stackId="1"
                    stroke="var(--chart-1)"
                    fill="url(#rawGrad)"
                    name="Raw Materials"
                  />
                  <Area
                    type="monotone"
                    dataKey="components"
                    stackId="1"
                    stroke="var(--chart-2)"
                    fill="url(#compGrad)"
                    name="Components"
                  />
                  <Area
                    type="monotone"
                    dataKey="finished"
                    stackId="1"
                    stroke="var(--chart-3)"
                    fill="url(#finGrad)"
                    name="Finished Goods"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-chart-1">{kpiData.mtbf}</p>
              <p className="mt-1 text-sm text-muted-foreground">MTBF (hours)</p>
              <p className="text-xs text-muted-foreground">Mean Time Between Failures</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-chart-2">{kpiData.capacityUtilization}%</p>
              <p className="mt-1 text-sm text-muted-foreground">Capacity Utilization</p>
              <p className="text-xs text-muted-foreground">Current plant capacity</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-chart-3">{kpiData.inventoryTurnover}</p>
              <p className="mt-1 text-sm text-muted-foreground">Inventory Turns</p>
              <p className="text-xs text-muted-foreground">Annual turnover rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">{(100 - kpiData.defectRate).toFixed(1)}%</p>
              <p className="mt-1 text-sm text-muted-foreground">Quality Rate</p>
              <p className="text-xs text-muted-foreground">Defect-free production</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({
  title,
  value,
  change,
  inverse = false,
  icon,
  description,
}: {
  title: string
  value: string
  change: number
  inverse?: boolean
  icon: React.ReactNode
  description: string
}) {
  const isPositive = inverse ? change < 0 : change > 0

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-accent' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
