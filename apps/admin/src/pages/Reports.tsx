import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download,
  DollarSign, 
  ShoppingCart, 
  Clock, 
  Gauge, 
  AlertTriangle, 
  Activity
} from 'lucide-react'
import { kpis, monthlyData, topCustomers } from '@/lib/admin-data'
import { 
  ComposedChart,
  Bar, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const kpiCards = [
  { title: 'Revenue YTD', value: `€${(kpis.revenueYTD / 1000000).toFixed(2)}M`, icon: DollarSign },
  { title: 'Active Orders', value: kpis.activeOrders.toString(), icon: ShoppingCart },
  { title: 'On-Time Delivery', value: `${kpis.otd}%`, icon: Clock },
  { title: 'Yield', value: `${kpis.yield}%`, icon: Gauge },
  { title: 'Critical Incidents', value: kpis.criticalIncidents.toString(), icon: AlertTriangle },
  { title: 'Capacity', value: `${kpis.capacity}%`, icon: Activity },
]

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Executive Summary Report</h2>
          <p className="text-sm text-muted-foreground">Fiscal Year 2026 — February Update</p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title} className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">{kpi.title}</p>
                <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Monthly Performance Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Month</TableHead>
                <TableHead className="text-muted-foreground text-right">Revenue</TableHead>
                <TableHead className="text-muted-foreground text-right">vs Target</TableHead>
                <TableHead className="text-muted-foreground text-right">Yield</TableHead>
                <TableHead className="text-muted-foreground text-right">OTD</TableHead>
                <TableHead className="text-muted-foreground text-right">Critical Incidents</TableHead>
                <TableHead className="text-muted-foreground text-right">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((month) => {
                const vsTarget = month.revenue >= month.target
                const variance = ((month.revenue - month.target) / month.target * 100).toFixed(1)
                return (
                  <TableRow key={month.month} className="border-border">
                    <TableCell className="font-medium">{month.month} 2026</TableCell>
                    <TableCell className={`text-right font-mono ${vsTarget ? 'text-success' : 'text-destructive'}`}>
                      €{(month.revenue / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell className={`text-right font-mono ${vsTarget ? 'text-success' : 'text-destructive'}`}>
                      {vsTarget ? '+' : ''}{variance}%
                    </TableCell>
                    <TableCell className={`text-right ${month.yield >= 92 ? 'text-success' : month.yield >= 90 ? 'text-warning' : 'text-destructive'}`}>
                      {month.yield}%
                    </TableCell>
                    <TableCell className={`text-right ${month.otd >= 94 ? 'text-success' : month.otd >= 90 ? 'text-warning' : 'text-destructive'}`}>
                      {month.otd}%
                    </TableCell>
                    <TableCell className={`text-right ${month.incidents === 0 ? 'text-success' : month.incidents === 1 ? 'text-warning' : 'text-destructive'}`}>
                      {month.incidents}
                    </TableCell>
                    <TableCell className="text-right">{month.margin}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Target */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" tickFormatter={(value) => `€${(value/1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    formatter={(value: number) => [`€${(value/1000000).toFixed(2)}M`, '']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Actual" radius={[4, 4, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                    name="Target"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gross Margin Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Gross Margin Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" domain={[35, 42]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    formatter={(value: number) => [`${value}%`, 'Margin']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="margin" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                    name="Gross Margin"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Top Customers by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Rank</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground text-right">Revenue</TableHead>
                <TableHead className="text-muted-foreground text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => {
                const totalRevenue = topCustomers.reduce((acc, c) => acc + c.revenue, 0)
                const percentage = ((customer.revenue / totalRevenue) * 100).toFixed(1)
                return (
                  <TableRow key={customer.name} className="border-border">
                    <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-right font-mono">€{(customer.revenue / 1000000).toFixed(2)}M</TableCell>
                    <TableCell className="text-right text-muted-foreground">{percentage}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
