// import { Link } from 'react-router-dom'
// import { ClipboardList, Layers, AlertTriangle, CheckCircle } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Progress } from '@/components/ui/progress'
// import { cn } from '@/lib/utils'
// import {
//   productionOrders,
//   incidents,
//   getActiveOrdersCount,
//   getBatchesInProgressCount,
//   getOpenIncidentsCount,
//   getCompletedTodayCount,
//   getCriticalIncident,
// } from '@/lib/mock-data'

// const statusStyles: Record<string, string> = {
//   in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//   pending: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   quality_check: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   completed: 'bg-green-500/20 text-green-400 border-green-500/30',
//   open: 'bg-red-500/20 text-red-400 border-red-500/30',
//   investigating: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
// }

// const priorityStyles: Record<string, string> = {
//   low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//   high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   critical: 'bg-red-500/20 text-red-400 border-red-500/30',
// }

// const severityStyles: Record<string, string> = {
//   low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
//   critical: 'bg-red-500/20 text-red-400 border-red-500/30',
// }

// function getProgressColor(percentage: number): string {
//   if (percentage < 30) return 'bg-red-500'
//   if (percentage < 70) return 'bg-amber-500'
//   return 'bg-green-500'
// }

// export default function Dashboard() {
//   const activeOrders = getActiveOrdersCount()
//   const batchesInProgress = getBatchesInProgressCount()
//   const openIncidents = getOpenIncidentsCount()
//   const completedToday = getCompletedTodayCount()
//   const criticalIncident = getCriticalIncident()

//   // Get active orders for "My orders today" table
//   const myOrders = productionOrders.filter((o) => o.status === 'in_progress').slice(0, 5)

//   // Get recent incidents
//   const recentIncidents = incidents.slice(0, 5)

//   return (
//     <div className="space-y-6">
//       {/* Stat Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
//             <ClipboardList className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{activeOrders}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Batches In Progress</CardTitle>
//             <Layers className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{batchesInProgress}</div>
//           </CardContent>
//         </Card>

//         <Card className={openIncidents > 0 ? 'border-red-500/50' : ''}>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Open Incidents</CardTitle>
//             <AlertTriangle className={cn('h-4 w-4', openIncidents > 0 ? 'text-red-500' : 'text-muted-foreground')} />
//           </CardHeader>
//           <CardContent>
//             <div className={cn('text-2xl font-bold', openIncidents > 0 && 'text-red-500')}>{openIncidents}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
//             <CheckCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{completedToday}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Critical Incident Alert */}
//       {criticalIncident && (
//         <div className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3">
//           <AlertTriangle className="h-5 w-5 text-red-500" />
//           <span className="text-sm font-medium text-red-400">
//             1 critical incident open — {criticalIncident.id} requires attention
//           </span>
//           <Link to="/incidents" className="ml-auto text-sm font-medium text-red-400 hover:underline">
//             View Details →
//           </Link>
//         </div>
//       )}

//       {/* Two Tables Side by Side */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* My Orders Today */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">My Orders Today</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-border">
//                     <th className="pb-3 text-left font-medium text-muted-foreground">PO#</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Progress</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Priority</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-border">
//                   {myOrders.map((order) => {
//                     const progressPercentage = Math.round((order.completed / order.quantity) * 100)
//                     return (
//                       <tr key={order.id}>
//                         <td className="py-3 font-mono text-xs">{order.id}</td>
//                         <td className="py-3">{order.product}</td>
//                         <td className="py-3">
//                           <div className="flex items-center gap-2">
//                             <Progress
//                               value={progressPercentage}
//                               className="h-2 w-16"
//                               indicatorClassName={getProgressColor(progressPercentage)}
//                             />
//                             <span className="text-xs text-muted-foreground">{progressPercentage}%</span>
//                           </div>
//                         </td>
//                         <td className="py-3">
//                           <span
//                             className={cn(
//                               'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                               statusStyles[order.status]
//                             )}
//                           >
//                             {order.status.replace('_', ' ')}
//                           </span>
//                         </td>
//                         <td className="py-3">
//                           <span
//                             className={cn(
//                               'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                               priorityStyles[order.priority]
//                             )}
//                           >
//                             {order.priority}
//                           </span>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Incidents */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Recent Incidents</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-border">
//                     <th className="pb-3 text-left font-medium text-muted-foreground">INC#</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Batch</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Title</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Severity</th>
//                     <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-border">
//                   {recentIncidents.map((incident) => (
//                     <tr key={incident.id}>
//                       <td className="py-3 font-mono text-xs">{incident.id}</td>
//                       <td className="py-3 font-mono text-xs">{incident.batchId}</td>
//                       <td className="max-w-[200px] truncate py-3" title={incident.title}>
//                         {incident.title}
//                       </td>
//                       <td className="py-3">
//                         <span
//                           className={cn(
//                             'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                             severityStyles[incident.severity]
//                           )}
//                         >
//                           {incident.severity}
//                         </span>
//                       </td>
//                       <td className="py-3">
//                         <span
//                           className={cn(
//                             'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                             statusStyles[incident.status]
//                           )}
//                         >
//                           {incident.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Layers, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ordersApi, incidentsApi, type ProductionOrder, type Incident, type ProductionKPIs } from '@/lib/api'

const statusStyles: Record<string, string> = {
  in_progress:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  planned:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
  completed:    'bg-green-500/20 text-green-400 border-green-500/30',
  quarantined:  'bg-red-500/20 text-red-400 border-red-500/30',
  open:         'bg-red-500/20 text-red-400 border-red-500/30',
  investigating:'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resolved:     'bg-green-500/20 text-green-400 border-green-500/30',
}
const priorityStyles: Record<string, string> = {
  low:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
  normal:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
  high:     'bg-amber-500/20 text-amber-400 border-amber-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}
const severityStyles: Record<string, string> = {
  low:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium:   'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}
function getProgressColor(pct: number) {
  if (pct < 30) return 'bg-red-500'
  if (pct < 70) return 'bg-amber-500'
  return 'bg-green-500'
}

export default function Dashboard() {
  const [kpis, setKpis]                 = useState<ProductionKPIs | null>(null)
  const [activeOrders, setActiveOrders] = useState<ProductionOrder[]>([])
  const [incidents, setIncidents]       = useState<Incident[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [kpiData, ordersData, incidentsData] = await Promise.all([
          ordersApi.getKPIs(),
          ordersApi.getAll({ status: 'in_progress' }),
          incidentsApi.getAll(),
        ])
        setKpis(kpiData)
        setActiveOrders(ordersData.slice(0, 5))
        setIncidents(incidentsData.slice(0, 5))
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const criticalIncident = incidents.find(i => i.status === 'open' && i.severity === 'critical')

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis?.active_orders ?? '—'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis?.total_orders ?? '—'}</div></CardContent>
        </Card>
        <Card className={criticalIncident ? 'border-red-500/50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Incidents</CardTitle>
            <AlertTriangle className={cn('h-4 w-4', criticalIncident ? 'text-red-500' : 'text-muted-foreground')} />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', criticalIncident && 'text-red-500')}>
              {incidents.filter(i => i.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis?.critical_orders ?? '—'}</div></CardContent>
        </Card>
      </div>

      {criticalIncident && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium text-red-400">Critical incident open — {criticalIncident.title}</span>
          <Link to="/incidents" className="ml-auto text-sm font-medium text-red-400 hover:underline">View Details →</Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">My Active Orders</CardTitle></CardHeader>
          <CardContent>
            {activeOrders.length === 0
              ? <p className="py-8 text-center text-sm text-muted-foreground">No active orders</p>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left font-medium text-muted-foreground">Order#</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Qty</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeOrders.map(order => (
                        <tr key={order.production_order_id}>
                          <td className="py-3 font-mono text-xs">{order.order_number}</td>
                          <td className="py-3">{order.product?.name ?? '—'}</td>
                          <td className="py-3">{order.quantity_ordered}</td>
                          <td className="py-3">
                            <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', priorityStyles[order.priority])}>
                              {order.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Incidents</CardTitle></CardHeader>
          <CardContent>
            {incidents.length === 0
              ? <p className="py-8 text-center text-sm text-muted-foreground">No incidents</p>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left font-medium text-muted-foreground">ID</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Title</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Severity</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {incidents.map(inc => (
                        <tr key={inc.incident_id}>
                          <td className="py-3 font-mono text-xs">{inc.incident_id}</td>
                          <td className="max-w-[200px] truncate py-3" title={inc.title}>{inc.title}</td>
                          <td className="py-3">
                            <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', severityStyles[inc.severity])}>
                              {inc.severity}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', statusStyles[inc.status])}>
                              {inc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  )
}