import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, CheckCircle2, TrendingUp, AlertTriangle, Loader2, Plus, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { productionApi, type ProductionOrder, type ProductionKPIs, type CreateProductionOrderPayload } from '@/lib/api'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  planned:     'bg-gray-500/20 text-gray-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed:   'bg-green-500/20 text-green-400',
  cancelled:   'bg-red-500/20 text-red-400',
}
const priorityColors: Record<string, string> = {
  low:      'bg-gray-500/20 text-gray-400',
  normal:   'bg-blue-500/20 text-blue-400',
  medium:   'bg-blue-500/20 text-blue-400',
  high:     'bg-amber-500/20 text-amber-400',
  urgent:   'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
}

export default function Production() {
  const [orders,      setOrders]      = useState<ProductionOrder[]>([])
  const [kpis,        setKpis]        = useState<ProductionKPIs | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [siteFilter,  setSiteFilter]  = useState('all')
  const [statusFilter,setStatusFilter]= useState('all')
  const [showCreate,  setShowCreate]  = useState(false)
  const [creating,    setCreating]    = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [products,    setProducts]    = useState<{product_id: number, name: string, reference: string}[]>([])
  const [form, setForm] = useState<CreateProductionOrderPayload>({
    title: '', priority: 'normal', site_id: 1, product_id: 0, quantity_ordered: 1,
    planned_start: '', planned_end: '',
  })

  useEffect(() => {
    fetch('http://localhost:4000/api/production/products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('aeronexis_token') || ''}` }
    }).then(r => r.json()).then(d => Array.isArray(d) && setProducts(d)).catch(() => {})
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const [o, k] = await Promise.all([productionApi.getOrders(), productionApi.getKPIs()])
        setOrders(o)
        setKpis(k)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  async function handleCreate() {
    if (!form.title.trim())   { setCreateError('Title is required'); return }
    if (!form.product_id)     { setCreateError('Please select a product'); return }
    if (form.quantity_ordered < 1) { setCreateError('Quantity must be at least 1'); return }
    setCreating(true)
    setCreateError(null)
    try {
      const newOrder = await productionApi.createOrder({
        ...form,
        planned_start: form.planned_start || undefined,
        planned_end:   form.planned_end   || undefined,
      })
      setOrders(prev => [newOrder, ...prev])
      setShowCreate(false)
      setForm({ title: '', priority: 'normal', site_id: 1, product_id: 0, quantity_ordered: 1, planned_start: '', planned_end: '' })
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create order')
    } finally { setCreating(false) }
  }

  const filtered = orders.filter(o => {
    const matchSite   = siteFilter === 'all'   || (o.site?.name ?? '').toLowerCase().includes(siteFilter.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSite && matchStatus
  })

  const chartData = ['planned','in_progress','completed','cancelled'].map(s => ({
    status: s.replace('_',' '),
    count:  orders.filter(o => o.status === s).length,
  }))

  const modal = null // rendered inline below

  return (
    <div className="space-y-6">
      {showCreate && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">New Production Order</CardTitle>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {createError && (
              <div className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{createError}</div>
            )}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Engine Component Batch A" />
              </div>
              <div className="space-y-1.5">
                <Label>Product <span className="text-destructive">*</span></Label>
                <select value={form.product_id}
                  onChange={e => setForm(p => ({ ...p, product_id: Number(e.target.value) }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <option value={0}>Select a product</option>
                  {(products || []).map(p => (
                    <option key={p.product_id} value={p.product_id}>{p.name} ({p.reference})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Quantity <span className="text-destructive">*</span></Label>
                <Input type="number" min={1} value={form.quantity_ordered}
                  onChange={e => setForm(p => ({ ...p, quantity_ordered: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <select value={form.priority}
                  onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {['low','normal','medium','high','urgent','critical'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Site</Label>
                <select value={form.site_id}
                  onChange={e => setForm(p => ({ ...p, site_id: Number(e.target.value) }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <option value={1}>Lyon</option>
                  <option value={2}>Toulouse</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Planned Start</Label>
                <Input type="date" value={form.planned_start}
                  onChange={e => setForm(p => ({ ...p, planned_start: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Planned End</Label>
                <Input type="date" value={form.planned_end}
                  onChange={e => setForm(p => ({ ...p, planned_end: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Active Orders',  value: kpis.active_orders    ?? 0, icon: ClipboardList, color: 'text-blue-400' },
            { label: 'Completed',      value: kpis.completed_orders ?? 0, icon: CheckCircle2,  color: 'text-green-400' },
            { label: 'Total',          value: kpis.total_orders     ?? 0, icon: TrendingUp,    color: 'text-purple-400' },
            { label: 'Critical',       value: kpis.critical_orders  ?? 0, icon: AlertTriangle, color: 'text-red-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold text-foreground">{value}</p>
                </div>
                <Icon className={cn('h-8 w-8', color)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Site:</span>
          {['all', 'Lyon', 'Toulouse'].map(s => (
            <Button key={s} variant={siteFilter === s ? 'default' : 'outline'} size="sm"
              onClick={() => setSiteFilter(s)}>
              {s === 'all' ? 'All' : s}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      {/* Table + Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Production Orders ({filtered.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order#</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Ref</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(o => (
                      <TableRow key={o.production_order_id}>
                        <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                        <TableCell>{o.product?.name ?? '—'}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{o.product?.reference ?? '—'}</TableCell>
                        <TableCell>{o.site?.name ?? '—'}</TableCell>
                        <TableCell>{o.quantity_ordered}</TableCell>
                        <TableCell>
                          <Badge className={cn('capitalize', statusColors[o.status])}>{o.status.replace('_',' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('capitalize', priorityColors[o.priority])}>{o.priority}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{o.planned_start ? new Date(o.planned_start).toLocaleDateString() : '—'}</TableCell>
                        <TableCell className="text-xs">{o.planned_end   ? new Date(o.planned_end).toLocaleDateString()   : '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle>Completion Rate</CardTitle></CardHeader>
            <CardContent>
              {kpis && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
                    <Progress value={kpis.total_orders > 0 ? Math.round((kpis.completed_orders / kpis.total_orders) * 100) : 0} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {kpis.completed_orders} / {kpis.total_orders} orders completed
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => [`${v}`, 'Orders']} />
                      <Bar dataKey="count" radius={[4,4,0,0]}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={['#3b82f6','#f59e0b','#22c55e','#ef4444'][i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}