import { AlertTriangle, Layers, ClipboardList } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { historyEntries, type HistoryEntry } from '@/lib/mock-data'

const actionTypeStyles: Record<HistoryEntry['actionType'], { icon: typeof AlertTriangle; color: string; bg: string }> = {
  incident: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
  },
  batch: {
    icon: Layers,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  order: {
    icon: ClipboardList,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
  },
}

export default function History() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historyEntries.map((entry, index) => {
              const style = actionTypeStyles[entry.actionType]
              const Icon = style.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4"
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', style.bg)}>
                    <Icon className={cn('h-5 w-5', style.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{entry.timestamp}</span>
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                          style.bg,
                          style.color,
                          entry.actionType === 'incident' && 'border-red-500/30',
                          entry.actionType === 'batch' && 'border-blue-500/30',
                          entry.actionType === 'order' && 'border-amber-500/30'
                        )}
                      >
                        {entry.actionType}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
