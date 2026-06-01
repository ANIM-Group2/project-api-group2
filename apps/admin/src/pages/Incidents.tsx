import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productionApi, type Incident, type IncidentStats } from '@/lib/api'
import { cn } from '@/lib/utils'

const severityColors: Record<string, string> = {
  low:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium:   'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}
const statusColors: Record<string, string> = {
  open:          'bg-red-500/20 text-red-400 border-red-500/30',
  investigating: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resolved:      'bg-green-500/20 text-green-400 border-green-500/30',
  closed:        'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function Incidents() {
  const [incidents,      setIncidents]      = useState<Incident[]>([])
  const [stats,          setStats]          = useState<IncidentStats | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter,   setStatusFilter]   = useState('all')

  useEffect(() => {
    async function load() {
      try {
        const [inc, st] = await Promise.all([
          productionApi.getIncidents(),
          productionApi.getIncidentStats(),
        ])
        setIncidents(inc)
        setStats(st)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = incidents.filter(i => {
    const matchSev    = severityFilter === 'all' || i.severity === severityFilter
    const matchStatus = statusFilter   === 'all' || i.status   === statusFilter
    return matchSev && matchStatus
  })

  const pieData = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, color: '#ef4444' },
    { name: 'High',     value: incidents.filter(i => i.severity === 'high').length,     color: '#f97316' },
    { name: 'Medium',   value: incidents.filter(i => i.severity === 'medium').length,   color: '#f59e0b' },
    { name: 'Low',      value: incidents.filter(i => i.severity === 'low').length,      color: '#6b7280' },
  ].filter(d => d.value > 0)

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Open',        value: stats?.open          ?? 0, icon: AlertCircle,  color: 'text-red-400',    bg: 'bg-red-500/10' },
          { title: 'Critical',    value: stats?.critical      ?? 0, icon: AlertTriangle,color: 'text-red-400',    bg: 'bg-red-500/10' },
          { title: 'Investigating',value: stats?.investigating ?? 0, icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-500/10' },
          { title: 'Resolved',    value: stats?.resolved      ?? 0, icon: CheckCircle2, color: 'text-green-400',  bg: 'bg-green-500/10' },
        ].map(k => {
          const Icon = k.icon
          return (
            <Card key={k.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{k.title}</p>
                    <p className={cn('text-2xl font-bold', k.color)}>{k.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg', k.bg)}><Icon className={cn('w-5 h-5', k.color)} /></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Severity:</span>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table + Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>All Incidents ({filtered.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Reported by</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(inc => (
                  <TableRow key={inc.incident_id}>
                    <TableCell className="font-mono text-xs">{inc.incident_id}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm" title={inc.title}>{inc.title}</TableCell>
                    <TableCell><Badge variant="outline" className={cn('capitalize', severityColors[inc.severity] ?? '')}>{inc.severity}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={cn('capitalize', statusColors[inc.status] ?? '')}>{inc.status}</Badge></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{inc.batch?.batch_number ?? `#${inc.batch_id}`}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {inc.reporter ? `${inc.reporter.first_name} ${inc.reporter.last_name}` : `#${inc.reported_by}`}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{inc.detected_at?.split('T')[0]}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No incidents found</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Severity Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="flex h-full items-center justify-center text-muted-foreground">No incidents</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}