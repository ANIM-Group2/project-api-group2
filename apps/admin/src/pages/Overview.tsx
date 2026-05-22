import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  Gauge, 
  AlertTriangle, 
  Activity,
  AlertCircle
} from 'lucide-react'
import { 
  kpis, 
  monthlyData, 
  productionMix, 
  incidents, 
  topCustomers 
} from '@/lib/admin-data'
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
  LineChart,
  Line,
  Legend
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const kpiCards = [
  { 
    title: 'Revenue YTD', 
    value: `€${(kpis.revenueYTD / 1000000).toFixed(2)}M`, 
    icon: DollarSign,
    color: 'text-primary'
  },
  { 
    title: 'Active Orders', 
    value: kpis.activeOrders.toString(), 
    icon: ShoppingCart,
    color: 'text-primary'
  },
  { 
    title: 'On-Time Delivery', 
    value: `${kpis.otd}%`, 
    icon: Clock,
    color: 'text-warning',
    status: 'warning'
  },
  { 
    title: 'Yield', 
    value: `${kpis.yield}%`, 
    icon: Gauge,
    color: 'text-success',
    status: 'success'
  },
  { 
    title: 'Critical Incidents', 
    value: kpis.criticalIncidents.toString(), 
    icon: AlertTriangle,
    color: 'text-destructive',
    status: 'danger'
  },
  { 
    title: 'Capacity', 
    value: `${kpis.capacity}%`, 
    icon: Activity,
    color: 'text-primary'
  },
]

const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved')

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    kpi.status === 'danger' ? 'bg-destructive/10' :
                    kpi.status === 'warning' ? 'bg-warning/10' :
                    kpi.status === 'success' ? 'bg-success/10' :
                    'bg-primary/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Critical Alert Banner */}
      {criticalIncidents.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">
            <span className="font-semibold">{criticalIncidents.length} critical incidents require immediate attention</span>
            {' — '}
            {criticalIncidents.map(i => i.id).join(' and ')}
          </p>
        </div>
      )}

      {/* Revenue Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Revenue vs Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `€${(value/1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  formatter={(value: number) => [`€${(value/1000000).toFixed(2)}M`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeDasharray="5 5" 
                  dot={false}
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Mix */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Production Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
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
                  >
                    {productionMix.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* OTD Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">On-Time Delivery Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" domain={[85, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    formatter={(value: number) => [`${value}%`, 'OTD']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="otd" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Incidents */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Critical Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.filter(i => i.severity === 'critical').map((incident) => (
                  <TableRow key={incident.id} className="border-border">
                    <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{incident.description}</TableCell>
                    <TableCell>
                      <Badge variant={incident.status === 'resolved' ? 'default' : 'destructive'}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top 5 Customers by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.name} className="border-border">
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-right">€{(customer.revenue / 1000000).toFixed(2)}M</TableCell>
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
