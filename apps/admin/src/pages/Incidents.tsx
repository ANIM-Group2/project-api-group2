import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react'
import { incidents } from '@/lib/admin-data'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const severityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/20 text-warning',
  critical: 'bg-destructive/20 text-destructive',
}

const statusColors: Record<string, string> = {
  open: 'bg-destructive/20 text-destructive',
  investigating: 'bg-warning/20 text-warning',
  resolved: 'bg-success/20 text-success',
}

const siteColors: Record<string, string> = {
  Lyon: 'bg-chart-1/20 text-chart-1',
  Toulouse: 'bg-chart-2/20 text-chart-2',
}

export default function Incidents() {
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [siteFilter, setSiteFilter] = useState<string>('all')

  const filteredIncidents = incidents.filter(incident => {
    if (severityFilter !== 'all' && incident.severity !== severityFilter) return false
    if (statusFilter !== 'all' && incident.status !== statusFilter) return false
    if (siteFilter !== 'all' && incident.site !== siteFilter) return false
    return true
  })

  const openIncidents = incidents.filter(i => i.status === 'open').length
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length

  // Severity distribution for pie chart
  const severityData = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, color: '#ef4444' },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: incidents.filter(i => i.severity === 'low').length, color: '#6b7280' },
  ]

  // Timeline data for bar chart
  const timelineData = [
    { date: 'Feb 02', Lyon: 1, Toulouse: 0 },
    { date: 'Feb 07', Lyon: 0, Toulouse: 1 },
    { date: 'Feb 10', Lyon: 1, Toulouse: 0 },
    { date: 'Feb 13', Lyon: 1, Toulouse: 0 },
    { date: 'Feb 15', Lyon: 1, Toulouse: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-destructive">{openIncidents}</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">{criticalIncidents}</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-success">{resolvedIncidents}</p>
              </div>
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold text-foreground">1.5 days</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Severity:</span>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Site:</span>
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              <SelectItem value="Lyon">Lyon</SelectItem>
              <SelectItem value="Toulouse">Toulouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Incidents Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Lot ID</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground">Severity</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Site</TableHead>
                <TableHead className="text-muted-foreground">Operator</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Units</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id} className="border-border">
                  <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{incident.lotId}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{incident.description}</TableCell>
                  <TableCell>
                    <Badge className={severityColors[incident.severity]}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[incident.status]}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={siteColors[incident.site]}>{incident.site}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{incident.operator}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{incident.date}</TableCell>
                  <TableCell className="text-sm">{incident.unitsAffected}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Incidents Timeline */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Incidents Timeline by Site</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                  <Legend />
                  <Bar dataKey="Lyon" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="Toulouse" fill="#10b981" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
