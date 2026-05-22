import { useState } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { alerts as initialAlerts, type Alert, type AlertSeverity } from '@/lib/logistics-data'
import { cn } from '@/lib/utils'

function getSeverityIcon(severity: AlertSeverity) {
  switch (severity) {
    case 'critical':
      return <AlertTriangle className="size-5 text-red-500" />
    case 'high':
      return <AlertCircle className="size-5 text-amber-500" />
    case 'medium':
      return <Info className="size-5 text-blue-500" />
    case 'low':
      return <CheckCircle2 className="size-5 text-emerald-500" />
    default:
      return null
  }
}

function getSeverityColor(severity: AlertSeverity) {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'high':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'medium':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'low':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    default:
      return ''
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'stock':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    case 'shipment':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'reservation':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    default:
      return ''
  }
}

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Alerts() {
  const [alertsList, setAlertsList] = useState<Alert[]>(initialAlerts)
  const [activeTab, setActiveTab] = useState('active')

  const activeAlerts = alertsList.filter((a) => !a.acknowledged)
  const historyAlerts = alertsList.filter((a) => a.acknowledged)

  const handleAcknowledge = (id: string) => {
    setAlertsList(
      alertsList.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  const displayAlerts = activeTab === 'active' ? activeAlerts : historyAlerts

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Alerts</h2>
        <p className="text-sm text-muted-foreground">
          {activeAlerts.length} active alerts
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="history">History ({historyAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4">
            {displayAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={cn(
                  'transition-opacity',
                  alert.acknowledged && 'opacity-60'
                )}
              >
                <CardContent className="py-4">
                  <div className="flex gap-4">
                    {/* Severity Icon */}
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      {getSeverityIcon(alert.severity)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{alert.title}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            getSeverityColor(alert.severity),
                            'capitalize'
                          )}
                        >
                          {alert.severity}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(getTypeColor(alert.type), 'capitalize')}
                        >
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </p>
                    </div>

                    {/* Action Button */}
                    {!alert.acknowledged && (
                      <div className="shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {displayAlerts.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {activeTab === 'active'
                      ? 'No active alerts'
                      : 'No alert history'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
