import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sites, operators } from '@/lib/admin-data'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
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
import { Progress } from '@/components/ui/progress'
import { MapPin, Users, AlertTriangle, Factory } from 'lucide-react'

const siteComparisonData = [
  { metric: 'Active Orders', Lyon: 6, Toulouse: 3 },
  { metric: 'Incidents', Lyon: 3, Toulouse: 1 },
  { metric: 'Operators', Lyon: 4, Toulouse: 1 },
]

const productBadgeColors: Record<string, string> = {
  Hydraulic: 'bg-chart-1/20 text-chart-1',
  Electronics: 'bg-chart-2/20 text-chart-2',
  Drone: 'bg-chart-3/20 text-chart-3',
  Mechanical: 'bg-chart-4/20 text-chart-4',
}

export default function Sites() {
  return (
    <div className="space-y-6">
      {/* Site Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sites.map((site) => (
          <Card key={site.name} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${site.name === 'Lyon' ? 'bg-chart-1/10' : 'bg-chart-2/10'}`}>
                    <MapPin className={`w-5 h-5 ${site.name === 'Lyon' ? 'text-chart-1' : 'text-chart-2'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">{site.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Production Site</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${site.capacity > 80 ? 'bg-success' : site.capacity > 60 ? 'bg-warning' : 'bg-destructive'}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Factory className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{site.activeOrders}</p>
                  <p className="text-xs text-muted-foreground">Active Orders</p>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{site.incidents}</p>
                  <p className="text-xs text-muted-foreground">Incidents</p>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{site.operators.length}</p>
                  <p className="text-xs text-muted-foreground">Operators</p>
                </div>
              </div>

              {/* Capacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Capacity Utilization</span>
                  <span className={`text-sm font-medium ${
                    site.capacity > 80 ? 'text-success' : site.capacity > 60 ? 'text-warning' : 'text-destructive'
                  }`}>{site.capacity}%</span>
                </div>
                <Progress 
                  value={site.capacity} 
                  className="h-2"
                  indicatorClassName={site.capacity > 80 ? 'bg-success' : site.capacity > 60 ? 'bg-warning' : 'bg-destructive'}
                />
              </div>

              {/* Products */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Product Lines</p>
                <div className="flex flex-wrap gap-2">
                  {site.products.map((product) => (
                    <Badge key={product} className={productBadgeColors[product] || 'bg-secondary text-secondary-foreground'}>
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Operators */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Team</p>
                <div className="flex flex-wrap gap-2">
                  {site.operators.map((operator) => (
                    <span 
                      key={operator} 
                      className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
                    >
                      {operator}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Site Comparison Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Site Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siteComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="metric" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Legend />
                <Bar dataKey="Lyon" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Toulouse" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Operators Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Operators Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Site</TableHead>
                <TableHead className="text-muted-foreground">Speciality</TableHead>
                <TableHead className="text-muted-foreground">Active Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator.name} className="border-border">
                  <TableCell className="font-medium">{operator.name}</TableCell>
                  <TableCell>
                    <Badge className={operator.site === 'Lyon' ? 'bg-chart-1/20 text-chart-1' : 'bg-chart-2/20 text-chart-2'}>
                      {operator.site}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{operator.speciality}</TableCell>
                  <TableCell className="text-sm">{operator.activeOrders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
