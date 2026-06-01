import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ordersApi, type CustomerOrder, formatCurrency, formatDate } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function Approvals() {
  const [orders,    setOrders]    = useState<CustomerOrder[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [approving, setApproving] = useState<number | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setOrders(await ordersApi.getAll())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally { setLoading(false) }
  }

  async function handleApprove(id: number) {
    try {
      setApproving(id)
      await ordersApi.approve(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to approve')
    } finally { setApproving(null) }
  }

  const pending   = orders.filter(o => o.status === 'draft')
  const confirmed = orders.filter(o => o.status === 'confirmed')
  const processed = orders.filter(o => !['draft', 'confirmed'].includes(o.status))

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  const OrderCard = ({ order, showApprove = false }: { order: CustomerOrder; showApprove?: boolean }) => (
    <Card className={cn('overflow-hidden', order.is_urgent && 'border-red-500/50')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-mono text-lg">#{order.customer_order_id}</CardTitle>
            <p className="mt-1 text-muted-foreground">{order.customer?.company_name ?? '—'}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {order.is_urgent && <Badge variant="outline" className="border-red-500/30 bg-red-500/20 text-red-300">URGENT</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="text-xl font-bold text-green-400">{formatCurrency(order.total_amount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Delivery</p>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{formatDate(order.expected_delivery)}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="text-sm">{order.customer?.country ?? '—'}</p>
        </div>
        {showApprove && order.status === 'draft' && (
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={approving === order.customer_order_id}
              onClick={() => handleApprove(order.customer_order_id)}>
              {approving === order.customer_order_id
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <CheckCircle className="mr-2 h-4 w-4" />}
              Approve
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pending.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmed.length})</TabsTrigger>
          <TabsTrigger value="history">History ({processed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-400" />
              <p className="mt-4 text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No pending approvals</p>
            </CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pending.map(o => <OrderCard key={o.customer_order_id} order={o} showApprove />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          {confirmed.length === 0
            ? <Card><CardContent className="py-12 text-center text-muted-foreground">No confirmed orders</CardContent></Card>
            : <div className="grid gap-4 md:grid-cols-2">{confirmed.map(o => <OrderCard key={o.customer_order_id} order={o} />)}</div>
          }
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {processed.length === 0
            ? <Card><CardContent className="py-12 text-center text-muted-foreground">No history yet</CardContent></Card>
            : <div className="grid gap-4 md:grid-cols-2">{processed.map(o => <OrderCard key={o.customer_order_id} order={o} />)}</div>
          }
        </TabsContent>
      </Tabs>
    </div>
  )
}