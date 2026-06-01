// import { useState } from 'react'
// import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { alerts as initialAlerts, type Alert, type AlertSeverity } from '@/lib/logistics-data'
// import { cn } from '@/lib/utils'

// function getSeverityIcon(severity: AlertSeverity) {
//   switch (severity) {
//     case 'critical':
//       return <AlertTriangle className="size-5 text-red-500" />
//     case 'high':
//       return <AlertCircle className="size-5 text-amber-500" />
//     case 'medium':
//       return <Info className="size-5 text-blue-500" />
//     case 'low':
//       return <CheckCircle2 className="size-5 text-emerald-500" />
//     default:
//       return null
//   }
// }

// function getSeverityColor(severity: AlertSeverity) {
//   switch (severity) {
//     case 'critical':
//       return 'bg-red-500/10 text-red-500 border-red-500/20'
//     case 'high':
//       return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
//     case 'medium':
//       return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
//     case 'low':
//       return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
//     default:
//       return ''
//   }
// }

// function getTypeColor(type: string) {
//   switch (type) {
//     case 'stock':
//       return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
//     case 'shipment':
//       return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
//     case 'reservation':
//       return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
//     default:
//       return ''
//   }
// }

// function formatTimestamp(timestamp: string) {
//   return new Date(timestamp).toLocaleString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   })
// }

// export default function Alerts() {
//   const [alertsList, setAlertsList] = useState<Alert[]>(initialAlerts)
//   const [activeTab, setActiveTab] = useState('active')

//   const activeAlerts = alertsList.filter((a) => !a.acknowledged)
//   const historyAlerts = alertsList.filter((a) => a.acknowledged)

//   const handleAcknowledge = (id: string) => {
//     setAlertsList(
//       alertsList.map((alert) =>
//         alert.id === id ? { ...alert, acknowledged: true } : alert
//       )
//     )
//   }

//   const displayAlerts = activeTab === 'active' ? activeAlerts : historyAlerts

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h2 className="text-xl font-semibold">Alerts</h2>
//         <p className="text-sm text-muted-foreground">
//           {activeAlerts.length} active alerts
//         </p>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList>
//           <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
//           <TabsTrigger value="history">History ({historyAlerts.length})</TabsTrigger>
//         </TabsList>

//         <TabsContent value={activeTab} className="mt-4">
//           <div className="grid gap-4">
//             {displayAlerts.map((alert) => (
//               <Card
//                 key={alert.id}
//                 className={cn(
//                   'transition-opacity',
//                   alert.acknowledged && 'opacity-60'
//                 )}
//               >
//                 <CardContent className="py-4">
//                   <div className="flex gap-4">
//                     {/* Severity Icon */}
//                     <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
//                       {getSeverityIcon(alert.severity)}
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 space-y-2">
//                       <div className="flex flex-wrap items-center gap-2">
//                         <span className="font-medium">{alert.title}</span>
//                         <Badge
//                           variant="outline"
//                           className={cn(
//                             getSeverityColor(alert.severity),
//                             'capitalize'
//                           )}
//                         >
//                           {alert.severity}
//                         </Badge>
//                         <Badge
//                           variant="outline"
//                           className={cn(getTypeColor(alert.type), 'capitalize')}
//                         >
//                           {alert.type}
//                         </Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         {alert.description}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {formatTimestamp(alert.timestamp)}
//                       </p>
//                     </div>

//                     {/* Action Button */}
//                     {!alert.acknowledged && (
//                       <div className="shrink-0">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleAcknowledge(alert.id)}
//                         >
//                           Acknowledge
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}

//             {displayAlerts.length === 0 && (
//               <Card>
//                 <CardContent className="py-12 text-center">
//                   <p className="text-muted-foreground">
//                     {activeTab === 'active'
//                       ? 'No active alerts'
//                       : 'No alert history'}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { alertsApi, type StockAlert } from '@/lib/api'
import { cn } from '@/lib/utils'

function getSeverityIcon(type: string) {
  if (type === 'out_of_stock') return <AlertTriangle className="size-5 text-red-500" />
  if (type === 'low_stock')    return <AlertCircle className="size-5 text-amber-500" />
  if (type === 'overstock')    return <Info className="size-5 text-blue-500" />
  return <CheckCircle2 className="size-5 text-emerald-500" />
}
function getSeverityColor(type: string) {
  if (type === 'out_of_stock') return 'bg-red-500/10 text-red-500 border-red-500/20'
  if (type === 'low_stock')    return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  if (type === 'overstock')    return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
}

export default function Alerts() {
  const [alerts,     setAlerts]     = useState<StockAlert[]>([])
  const [acked,      setAcked]      = useState<StockAlert[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [tab,        setTab]        = useState('active')
  const [acking,     setAcking]     = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [active, resolved] = await Promise.all([
        alertsApi.getAll('active'),
        alertsApi.getAll('acknowledged'),
      ])
      setAlerts(active)
      setAcked(resolved)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  async function handleAcknowledge(id: string) {
    try {
      setAcking(id)
      await alertsApi.acknowledge(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to acknowledge')
    } finally {
      setAcking(null)
    }
  }

  const display = tab === 'active' ? alerts : acked

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
      <div>
        <h2 className="text-xl font-semibold">Alerts</h2>
        <p className="text-sm text-muted-foreground">{alerts.length} active alerts</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({alerts.length})</TabsTrigger>
          <TabsTrigger value="history">Acknowledged ({acked.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="grid gap-4">
            {display.map(alert => (
              <Card key={alert._id} className={cn(tab === 'history' && 'opacity-60')}>
                <CardContent className="py-4">
                  <div className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      {getSeverityIcon(alert.alert_type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          {alert.alert_type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                        <Badge variant="outline" className={cn(getSeverityColor(alert.alert_type), 'capitalize')}>
                          {alert.alert_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Material ref: {alert.product_ref} — current: {alert.current_qty} (threshold: {alert.threshold})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                    {tab === 'active' && (
                      <div className="shrink-0">
                        <Button variant="outline" size="sm"
                          disabled={acking === alert._id}
                          onClick={() => handleAcknowledge(alert._id)}>
                          {acking === alert._id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Acknowledge'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {display.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{tab === 'active' ? 'No active alerts' : 'No alert history'}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}