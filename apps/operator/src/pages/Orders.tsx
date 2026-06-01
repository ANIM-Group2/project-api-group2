// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Progress } from '@/components/ui/progress'
// import { cn } from '@/lib/utils'
// import { productionOrders, type ProductionOrder } from '@/lib/mock-data'

// const statusStyles: Record<string, string> = {
//   in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//   pending: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   quality_check: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   completed: 'bg-green-500/20 text-green-400 border-green-500/30',
// }

// const priorityStyles: Record<string, string> = {
//   low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//   high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   critical: 'bg-red-500/20 text-red-400 border-red-500/30',
// }

// function getProgressColor(percentage: number): string {
//   if (percentage < 30) return 'bg-red-500'
//   if (percentage < 70) return 'bg-amber-500'
//   return 'bg-green-500'
// }

// type FilterStatus = 'all' | 'in_progress' | 'pending' | 'quality_check' | 'completed'

// export default function Orders() {
//   const [filter, setFilter] = useState<FilterStatus>('all')
//   const [orders, setOrders] = useState<ProductionOrder[]>(productionOrders)

//   const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

//   const handleStart = (orderId: string) => {
//     setOrders((prev) =>
//       prev.map((o) => (o.id === orderId ? { ...o, status: 'in_progress' as const } : o))
//     )
//   }

//   const handleComplete = (orderId: string) => {
//     setOrders((prev) =>
//       prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' as const, completed: o.quantity } : o))
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <CardTitle>Manufacturing Orders</CardTitle>
//             <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
//               <TabsList>
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="in_progress">In Progress</TabsTrigger>
//                 <TabsTrigger value="pending">Pending</TabsTrigger>
//                 <TabsTrigger value="quality_check">Quality Check</TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border">
//                   <th className="pb-3 text-left font-medium text-muted-foreground">PO#</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Part#</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Qty</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Progress</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Priority</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Start</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Due</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Workstation</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {filteredOrders.map((order) => {
//                   const progressPercentage = Math.round((order.completed / order.quantity) * 100)
//                   return (
//                     <tr key={order.id}>
//                       <td className="py-3 font-mono text-xs">{order.id}</td>
//                       <td className="py-3">{order.product}</td>
//                       <td className="py-3 font-mono text-xs text-muted-foreground">{order.partNumber}</td>
//                       <td className="py-3">{order.quantity}</td>
//                       <td className="py-3">
//                         <div className="flex items-center gap-2">
//                           <Progress
//                             value={progressPercentage}
//                             className="h-2 w-20"
//                             indicatorClassName={getProgressColor(progressPercentage)}
//                           />
//                           <span className="text-xs text-muted-foreground">{progressPercentage}%</span>
//                         </div>
//                       </td>
//                       <td className="py-3">
//                         <span
//                           className={cn(
//                             'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                             statusStyles[order.status]
//                           )}
//                         >
//                           {order.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                       <td className="py-3">
//                         <span
//                           className={cn(
//                             'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                             priorityStyles[order.priority]
//                           )}
//                         >
//                           {order.priority}
//                         </span>
//                       </td>
//                       <td className="py-3 text-muted-foreground">{order.startDate}</td>
//                       <td className="py-3 text-muted-foreground">{order.dueDate}</td>
//                       <td className="py-3 font-mono text-xs text-muted-foreground">{order.workstation}</td>
//                       <td className="py-3">
//                         {order.status === 'pending' && (
//                           <Button size="sm" onClick={() => handleStart(order.id)}>
//                             Start
//                           </Button>
//                         )}
//                         {order.status === 'in_progress' && (
//                           <Button size="sm" variant="secondary" onClick={() => handleComplete(order.id)}>
//                             Complete
//                           </Button>
//                         )}
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//             {filteredOrders.length === 0 && (
//               <div className="py-12 text-center text-muted-foreground">No orders found</div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ordersApi, type ProductionOrder } from '@/lib/api'

const statusStyles: Record<string, string> = {
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  planned:     'bg-gray-500/20 text-gray-400 border-gray-500/30',
  completed:   'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled:   'bg-red-500/20 text-red-400 border-red-500/30',
}
const priorityStyles: Record<string, string> = {
  low:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
  normal:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
  high:     'bg-amber-500/20 text-amber-400 border-amber-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

type FilterStatus = 'all' | 'planned' | 'in_progress' | 'completed'

export default function Orders() {
  const [filter, setFilter]   = useState<FilterStatus>('all')
  const [orders, setOrders]   = useState<ProductionOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      const data = await ordersApi.getAll()
      setOrders(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(orderId: number, status: string) {
    try {
      setUpdating(orderId)
      const updated = await ordersApi.updateStatus(orderId, status)
      setOrders(prev => prev.map(o => o.production_order_id === orderId ? { ...o, status: updated.status } : o))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
  if (error) return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Manufacturing Orders</CardTitle>
            <Tabs value={filter} onValueChange={v => setFilter(v as FilterStatus)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="planned">Planned</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Order#</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Ref</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Qty</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Site</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Priority</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Start</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">End</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(order => (
                  <tr key={order.production_order_id}>
                    <td className="py-3 font-mono text-xs">{order.order_number}</td>
                    <td className="py-3">{order.product?.name ?? '—'}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{order.product?.reference ?? '—'}</td>
                    <td className="py-3">{order.quantity_ordered}</td>
                    <td className="py-3 text-muted-foreground">{order.site?.name ?? '—'}</td>
                    <td className="py-3">
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', statusStyles[order.status] ?? '')}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', priorityStyles[order.priority] ?? '')}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{order.planned_start ? order.planned_start.split('T')[0] : '—'}</td>
                    <td className="py-3 text-muted-foreground">{order.planned_end ? order.planned_end.split('T')[0] : '—'}</td>
                    <td className="py-3">
                      {order.status === 'planned' && (
                        <Button size="sm" disabled={updating === order.production_order_id}
                          onClick={() => handleUpdateStatus(order.production_order_id, 'in_progress')}>
                          {updating === order.production_order_id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Start'}
                        </Button>
                      )}
                      {order.status === 'in_progress' && (
                        <Button size="sm" variant="secondary" disabled={updating === order.production_order_id}
                          onClick={() => handleUpdateStatus(order.production_order_id, 'completed')}>
                          {updating === order.production_order_id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Complete'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No orders found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}