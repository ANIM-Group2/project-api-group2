// import { AlertTriangle, Package, ClipboardList, Truck, Bell } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import {
//   materials,
//   reservations,
//   shipments,
//   getActiveAlerts,
//   type MaterialStatus,
//   type ShipmentStatus,
// } from '@/lib/logistics-data'
// import { cn } from '@/lib/utils'

// function getStatusColor(status: MaterialStatus) {
//   switch (status) {
//     case 'OK':
//       return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
//     case 'Low':
//       return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
//     case 'Critical':
//       return 'bg-red-500/10 text-red-500 border-red-500/20'
//     default:
//       return ''
//   }
// }

// function getShipmentStatusColor(status: ShipmentStatus) {
//   switch (status) {
//     case 'Scheduled':
//       return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
//     case 'In transit':
//       return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
//     case 'Delivered':
//       return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
//     case 'Delayed':
//       return 'bg-red-500/10 text-red-500 border-red-500/20'
//     default:
//       return ''
//   }
// }

// export default function Dashboard() {
//   const activeAlerts = getActiveAlerts()
//   const activeReservations = reservations.filter((r) => r.status === 'active')
//   const criticalAlerts = activeAlerts.filter(
//     (a) => a.severity === 'critical' || a.severity === 'high'
//   )

//   const stats = [
//     {
//       title: 'Total SKUs',
//       value: materials.length,
//       icon: Package,
//       color: 'text-blue-500',
//     },
//     {
//       title: 'Active Reservations',
//       value: activeReservations.length,
//       icon: ClipboardList,
//       color: 'text-emerald-500',
//     },
//     {
//       title: 'Shipments This Week',
//       value: shipments.length,
//       icon: Truck,
//       color: 'text-amber-500',
//     },
//     {
//       title: 'Active Alerts',
//       value: activeAlerts.length,
//       icon: Bell,
//       color: 'text-red-500',
//       highlight: true,
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => {
//           const Icon = stat.icon
//           return (
//             <Card key={stat.title}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {stat.title}
//                 </CardTitle>
//                 <Icon className={cn('size-5', stat.color)} />
//               </CardHeader>
//               <CardContent>
//                 <div
//                   className={cn(
//                     'text-2xl font-bold',
//                     stat.highlight && 'text-red-500'
//                   )}
//                 >
//                   {stat.value}
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Alert Banner */}
//       {criticalAlerts.length > 0 && (
//         <Card className="border-red-500/50 bg-red-500/5">
//           <CardContent className="flex items-start gap-4 py-4">
//             <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
//               <AlertTriangle className="size-5 text-red-500" />
//             </div>
//             <div className="space-y-2">
//               {criticalAlerts.map((alert) => (
//                 <div key={alert.id}>
//                   <p className="text-sm font-medium text-red-500">
//                     {alert.title}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     {alert.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Stock Overview Table */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Stock Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Material Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead className="text-right">Current</TableHead>
//                   <TableHead className="text-right">Reserved</TableHead>
//                   <TableHead className="text-right">Available</TableHead>
//                   <TableHead className="text-right">Safety</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {materials.map((material) => (
//                   <TableRow key={material.id}>
//                     <TableCell className="font-mono text-sm">
//                       {material.code}
//                     </TableCell>
//                     <TableCell>{material.description}</TableCell>
//                     <TableCell className="text-right">
//                       {material.stock.toLocaleString()} {material.unit}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {material.reserved.toLocaleString()} {material.unit}
//                     </TableCell>
//                     <TableCell className="text-right font-medium">
//                       {(material.stock - material.reserved).toLocaleString()}{' '}
//                       {material.unit}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {material.safetyThreshold.toLocaleString()} {material.unit}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant="outline"
//                         className={getStatusColor(material.status)}
//                       >
//                         {material.status}
//                       </Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Upcoming Shipments */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Upcoming Shipments</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {shipments.slice(0, 5).map((shipment) => (
//                 <div
//                   key={shipment.id}
//                   className="flex items-center justify-between rounded-lg border p-4"
//                 >
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-mono text-sm font-medium">
//                         {shipment.id}
//                       </span>
//                       <Badge
//                         variant="outline"
//                         className={cn(
//                           getShipmentStatusColor(shipment.status),
//                           'text-xs'
//                         )}
//                       >
//                         {shipment.status}
//                       </Badge>
//                       <Badge variant="secondary" className="text-xs">
//                         {shipment.type}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {shipment.origin} → {shipment.destination}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {shipment.items}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium">ETA: {shipment.eta}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {shipment.carrier}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }




import { useEffect, useState } from 'react'
import { AlertTriangle, Package, ClipboardList, Truck, Bell, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { stockApi, reservationsApi, shipmentsApi, alertsApi, type RawMaterial, type StockAlert, type Shipment } from '@/lib/api'
import { cn } from '@/lib/utils'

function getStockStatus(m: RawMaterial) {
  const avail = m.stock_quantity - m.reserved_quantity
  if (avail <= 0 || avail < m.safety_threshold * 0.5) return 'Critical'
  if (avail < m.safety_threshold) return 'Low'
  return 'OK'
}
function getStatusColor(status: string) {
  if (status === 'OK')       return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  if (status === 'Low')      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  if (status === 'Critical') return 'bg-red-500/10 text-red-500 border-red-500/20'
  return ''
}
function getShipmentStatusColor(status: string) {
  if (status === 'scheduled') return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  if (status === 'in_transit') return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  if (status === 'delivered') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  if (status === 'delayed')   return 'bg-red-500/10 text-red-500 border-red-500/20'
  return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

export default function Dashboard() {
  const [materials,     setMaterials]     = useState<RawMaterial[]>([])
  const [activeRes,     setActiveRes]     = useState(0)
  const [shipments,     setShipments]     = useState<Shipment[]>([])
  const [alerts,        setAlerts]        = useState<StockAlert[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [mats, res, alertData] = await Promise.all([
          stockApi.getAll(),
          reservationsApi.getAll(),
          alertsApi.getAll('active'),
        ])
        // shipments may fail if ms-orders isn't running — graceful fallback
        let ships: Shipment[] = []
        try {
          const raw = await shipmentsApi.getAll()
          ships = Array.isArray(raw) ? raw : (raw as any).data ?? []
        } catch { /* optional */ }

        setMaterials(mats)
        setActiveRes(res.filter(r => r.is_active).length)
        setShipments(ships.slice(0, 5))
        setAlerts(alertData)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const criticalAlerts = alerts.filter(a => a.alert_type === 'out_of_stock' || a.alert_type === 'low_stock')

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
  if (error) return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
  )

  const stats = [
    { title: 'Total SKUs',           value: materials.length,  icon: Package,     color: 'text-blue-500' },
    { title: 'Active Reservations',  value: activeRes,         icon: ClipboardList,color: 'text-emerald-500' },
    { title: 'Shipments',            value: shipments.length,  icon: Truck,       color: 'text-amber-500' },
    { title: 'Active Alerts',        value: alerts.length,     icon: Bell,        color: 'text-red-500', highlight: true },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={cn('size-5', stat.color)} />
              </CardHeader>
              <CardContent>
                <div className={cn('text-2xl font-bold', stat.highlight && 'text-red-500')}>{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {criticalAlerts.length > 0 && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="size-5 text-red-500" />
            </div>
            <div className="space-y-2">
              {criticalAlerts.map(a => (
                <div key={a._id}>
                  <p className="text-sm font-medium text-red-500">{a.alert_type.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">Material #{a.product_id} — current: {a.current_qty} (threshold: {a.threshold})</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Stock Overview</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Safety</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map(m => {
                  const status = getStockStatus(m)
                  const avail  = m.stock_quantity - m.reserved_quantity
                  return (
                    <TableRow key={m.material_id}>
                      <TableCell className="font-mono text-sm">{m.reference}</TableCell>
                      <TableCell>{m.name}</TableCell>
                      <TableCell className="text-right">{m.stock_quantity.toLocaleString()} {m.unit}</TableCell>
                      <TableCell className="text-right">{m.reserved_quantity.toLocaleString()} {m.unit}</TableCell>
                      <TableCell className="text-right font-medium">{avail.toLocaleString()} {m.unit}</TableCell>
                      <TableCell className="text-right">{m.safety_threshold.toLocaleString()} {m.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(status)}>{status}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {shipments.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Recent Shipments</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.map((s, i) => (
                  <div key={s.shipment_id ?? i} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">#{s.shipment_id}</span>
                        <Badge variant="outline" className={cn(getShipmentStatusColor(s.status), 'text-xs capitalize')}>
                          {s.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer: {s.customer_name ?? s.customer_order_id}</p>
                      {s.carrier && <p className="text-xs text-muted-foreground">{s.carrier}</p>}
                    </div>
                    <div className="text-right">
                      {s.estimated_delivery && <p className="text-sm font-medium">ETA: {s.estimated_delivery.split('T')[0]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
