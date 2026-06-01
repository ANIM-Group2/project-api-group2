// import { AlertTriangle, Layers, ClipboardList } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { cn } from '@/lib/utils'
// import { historyEntries, type HistoryEntry } from '@/lib/mock-data'

// const actionTypeStyles: Record<HistoryEntry['actionType'], { icon: typeof AlertTriangle; color: string; bg: string }> = {
//   incident: {
//     icon: AlertTriangle,
//     color: 'text-red-400',
//     bg: 'bg-red-500/20',
//   },
//   batch: {
//     icon: Layers,
//     color: 'text-blue-400',
//     bg: 'bg-blue-500/20',
//   },
//   order: {
//     icon: ClipboardList,
//     color: 'text-amber-400',
//     bg: 'bg-amber-500/20',
//   },
// }

// export default function History() {
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Activity History</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {historyEntries.map((entry, index) => {
//               const style = actionTypeStyles[entry.actionType]
//               const Icon = style.icon
//               return (
//                 <div
//                   key={index}
//                   className="flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4"
//                 >
//                   <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', style.bg)}>
//                     <Icon className={cn('h-5 w-5', style.color)} />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3">
//                       <span className="text-sm font-medium text-foreground">{entry.timestamp}</span>
//                       <span
//                         className={cn(
//                           'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                           style.bg,
//                           style.color,
//                           entry.actionType === 'incident' && 'border-red-500/30',
//                           entry.actionType === 'batch' && 'border-blue-500/30',
//                           entry.actionType === 'order' && 'border-amber-500/30'
//                         )}
//                       >
//                         {entry.actionType}
//                       </span>
//                     </div>
//                     <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { AlertTriangle, Layers, ClipboardList, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { batchesApi, incidentsApi, type BatchActionLog, type Incident } from '@/lib/api'

type TimelineEntry = {
  timestamp: string
  type: 'batch_action' | 'incident'
  label: string
  description: string
}

export default function History() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // Fetch all batches to get their IDs, then fetch histories
        const [batches, incidents] = await Promise.all([
          batchesApi.getAll(),
          incidentsApi.getAll(),
        ])

        // Fetch action logs for up to 10 most recent batches
        const recentBatches = batches.slice(0, 10)
        const allLogs: BatchActionLog[] = []

        await Promise.all(
          recentBatches.map(async b => {
            const logs = await batchesApi.getHistory(b.batch_id)
            allLogs.push(...logs)
          })
        )

        // Build unified timeline
        const entries: TimelineEntry[] = [
          ...allLogs.map((log): TimelineEntry => ({
            timestamp: log.timestamp,
            type: 'batch_action',
            label: log.action.replace('_', ' '),
            description: `Batch ${log.batch_number} — ${log.action.replace('_', ' ')}${log.new_status ? ` → ${log.new_status}` : ''}${log.notes ? ` (${log.notes})` : ''}`,
          })),
          ...incidents.map((inc: Incident): TimelineEntry => ({
            timestamp: inc.detected_at,
            type: 'incident',
            label: inc.severity,
            description: `Incident on batch ${inc.batch_id} — ${inc.title} [${inc.status}]`,
          })),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 30)

        setTimeline(entries)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const iconMap = {
    incident:     { Icon: AlertTriangle, color: 'text-red-400',   bg: 'bg-red-500/20',   border: 'border-red-500/30' },
    batch_action: { Icon: Layers,        color: 'text-blue-400',  bg: 'bg-blue-500/20',  border: 'border-blue-500/30' },
  }

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
        <CardHeader><CardTitle>Activity History</CardTitle></CardHeader>
        <CardContent>
          {timeline.length === 0
            ? <p className="py-8 text-center text-sm text-muted-foreground">No activity yet</p>
            : (
              <div className="space-y-4">
                {timeline.map((entry, i) => {
                  const style = iconMap[entry.type]
                  const Icon = style.Icon
                  return (
                    <div key={i} className="flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', style.bg)}>
                        <Icon className={cn('h-5 w-5', style.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', style.bg, style.color, style.border)}>
                            {entry.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </CardContent>
      </Card>
    </div>
  )
}