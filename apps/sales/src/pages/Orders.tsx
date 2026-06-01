import { useEffect, useState } from 'react'
import { Search, Eye, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ordersApi, type CustomerOrder, formatCurrency, formatDate } from '@/lib/api'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft:         'bg-gray-500/20 text-gray-300 border-gray-500/30',
  confirmed:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_production: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  shipped:       'bg-amber-500/20 text-amber-300 border-amber-500/30',
  delivered:     'bg-green-500/20 text-green-300 border-green-500/30',
  cancelled:     'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function Orders() {
  const [orders,   setOrders]   = useState<CustomerOrder[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<CustomerOrder | null>(null)
  const [approving, setApproving] = useState<number | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setOrders(await ordersApi.getAll())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  async function openDetail(id: number) {
    try {
      const full = await ordersApi.getById(id)
      setSelected(full)
    } catch { setSelected(orders.find(o => o.customer_order_id === id) ?? null) }
  }

  async function handleApprove(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      setApproving(id)
      await ordersApi.approve(id)
      await load()
      if (selected?.customer_order_id === id) setSelected(null)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Approval failed')
    } finally { setApproving(null) }
  }

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      String(o.customer_order_id).includes(search) ||
      (o.customer?.company_name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const pendingCount = orders.filter(o => o.status === 'draft').length

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Orders {pendingCount > 0 && <span className="ml-2 text-sm font-normal text-amber-400">({pendingCount} pending approval)</span>}</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search orders..." className="w-64 pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <Tabs value={filter} onValueChange={setFilter} className="mt-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="in_production">In Production</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Urgent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.customer_order_id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(o.customer_order_id)}>
                  <TableCell className="font-mono font-medium">#{o.customer_order_id}</TableCell>
                  <TableCell>{o.customer?.company_name ?? '—'}</TableCell>
                  <TableCell>{formatDate(o.expected_delivery)}</TableCell>
                  <TableCell className="text-right font-medium text-green-400">{formatCurrency(o.total_amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[o.status] ?? ''}>{o.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{o.is_urgent ? <span className="text-xs font-medium text-red-400">URGENT</span> : '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {o.status === 'draft' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700"
                          disabled={approving === o.customer_order_id}
                          onClick={e => handleApprove(o.customer_order_id, e)}>
                          {approving === o.customer_order_id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle className="mr-1 h-3 w-3" />Approve</>}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); openDetail(o.customer_order_id) }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">No orders found</p>}
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="font-mono">#{selected?.customer_order_id}</span>
              {selected && <Badge variant="outline" className={statusColors[selected.status] ?? ''}>{selected.status.replace('_', ' ')}</Badge>}
            </SheetTitle>
          </SheetHeader>
          {selected && (
            <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
              <div className="space-y-4 pr-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="text-lg font-medium">{selected.customer?.company_name ?? '—'}</p>
                  <p className="text-sm text-muted-foreground">{selected.customer?.country}</p>
                  {selected.customer?.email && <p className="text-xs text-muted-foreground mt-1">{selected.customer.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Delivery', formatDate(selected.expected_delivery)],
                    ['Amount',   formatCurrency(selected.total_amount)],
                    ['Status',   selected.status.replace('_', ' ')],
                    ['Urgent',   selected.is_urgent ? 'Yes' : 'No'],
                  ].map(([label, val]) => (
                    <div key={label} className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium mt-1">{val}</p>
                    </div>
                  ))}
                </div>
                {selected.items && selected.items.length > 0 && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm font-medium mb-3">Order Lines</p>
                    <div className="space-y-2">
                      {selected.items.map((line, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{line.product?.name ?? `Product #${line.product_id}`} × {line.quantity}</span>
                          <span className="font-medium">{formatCurrency(line.quantity * line.unit_price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selected.status === 'draft' && (
                  <Button className="w-full bg-green-600 hover:bg-green-700"
                    disabled={approving === selected.customer_order_id}
                    onClick={e => handleApprove(selected.customer_order_id, e)}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Order
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}