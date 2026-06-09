import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Activity, RefreshCw, Loader2, Package, AlertTriangle, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const GATEWAY = 'http://localhost:4000'

interface LogEntry {
  _id: string
  _type: 'batch_action' | 'incident' | 'stock_movement'
  _time: string
  action?: string
  previous_status?: string
  new_status?: string
  batch_number?: string
  batch_id?: number
  operator_id?: number
  notes?: string
  title?: string
  severity?: string
  reported_by?: number
  movement_type?: string
  quantity?: number
  previous_qty?: number
  new_qty?: number
  product_ref?: string
  reason?: string
  performed_by?: number
  actor_name?: string
}

const TYPE_COLORS: Record<string, string> = {
  batch_action:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  incident:       'bg-red-500/10 text-red-400 border-red-500/20',
  stock_movement: 'bg-green-500/10 text-green-400 border-green-500/20',
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  batch_action:   <Package className="h-3.5 w-3.5" />,
  incident:       <AlertTriangle className="h-3.5 w-3.5" />,
  stock_movement: <BarChart3 className="h-3.5 w-3.5" />,
}

function getDescription(log: LogEntry): string {
  switch (log._type) {
    case 'batch_action':
      return log.previous_status
        ? `Batch ${log.batch_number || log.batch_id}: ${log.previous_status} → ${log.new_status}`
        : `Batch ${log.batch_number || log.batch_id}: ${log.action}`
    case 'incident':
      return `${log.title || 'Incident'} — ${log.severity} severity`
    case 'stock_movement':
      return `${log.product_ref || 'Material'}: ${log.movement_type} of ${log.quantity} units (${log.previous_qty} → ${log.new_qty})`
    default:
      return JSON.stringify(log)
  }
}

export default function Logs() {
  const [logs, setLogs]       = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [type, setType]       = useState('all')
  const [search, setSearch]   = useState('')
  const [limit, setLimit]     = useState('100')

  async function fetchLogs() {
    setLoading(true)
    setError(null)
    try {
      const token  = localStorage.getItem('aeronexis_token') || ''
      const params = new URLSearchParams({ limit })
      if (type !== 'all') params.set('type', type)
      const res = await fetch(`${GATEWAY}/api/traceability/logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setLogs(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLogs() }, [type, limit])

  const filtered = logs.filter(log => {
    if (!search) return true
    const desc = getDescription(log).toLowerCase()
    return desc.includes(search.toLowerCase())
  })

  const counts = {
    batch_action:   logs.filter(l => l._type === 'batch_action').length,
    incident:       logs.filter(l => l._type === 'incident').length,
    stock_movement: logs.filter(l => l._type === 'stock_movement').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Audit trail of all critical actions across production, inventory, and quality
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: 'batch_action',   label: 'Batch Events',     icon: Package,       color: 'text-blue-400' },
          { key: 'incident',       label: 'Incident Events',   icon: AlertTriangle, color: 'text-red-400' },
          { key: 'stock_movement', label: 'Stock Movements',   icon: BarChart3,     color: 'text-green-400' },
        ].map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setType(type === key ? 'all' : key)}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className={cn('h-5 w-5', color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{counts[key as keyof typeof counts]}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">
              {filtered.length} log entries
              {type !== 'all' && ` — filtered by ${type.replace('_', ' ')}`}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="batch_action">Batch actions</SelectItem>
                <SelectItem value="incident">Incidents</SelectItem>
                <SelectItem value="stock_movement">Stock movements</SelectItem>
              </SelectContent>
            </Select>
            <Select value={limit} onValueChange={setLimit}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">Last 50</SelectItem>
                <SelectItem value="100">Last 100</SelectItem>
                <SelectItem value="250">Last 250</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-32">Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Actor</TableHead>
                    <TableHead className="w-44">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                        No logs found
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((log, i) => (
                    <TableRow key={log._id || i} className="hover:bg-muted/30">
                      <TableCell>
                        <Badge variant="outline" className={cn('gap-1 text-xs', TYPE_COLORS[log._type])}>
                          {TYPE_ICONS[log._type]}
                          {log._type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground max-w-md truncate">
                        {getDescription(log)}
                        {log.notes && <span className="text-muted-foreground ml-2 text-xs">— {log.notes}</span>}
                        {log.reason && <span className="text-muted-foreground ml-2 text-xs">— {log.reason}</span>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.actor_name || `#${log.operator_id || log.reported_by || log.performed_by || '—'}`}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log._time).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}