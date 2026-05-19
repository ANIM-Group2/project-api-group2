'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Package,
  Truck,
  GitBranch,
  Check,
} from 'lucide-react'
import { alerts as initialAlerts, Alert } from '@/lib/logistics-data'
import { formatDistanceToNow } from 'date-fns'

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [activeTab, setActiveTab] = useState<string>('active')

  const activeAlerts = alerts.filter((a) => !a.acknowledged)
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged)

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
  }

  const displayedAlerts = activeTab === 'active' ? activeAlerts : acknowledgedAlerts

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            Active
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Alerts list */}
      <div className="space-y-4">
        {displayedAlerts.map((alert) => (
          <Card key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-destructive/10 text-destructive'
                      : alert.severity === 'high'
                      ? 'bg-destructive/10 text-destructive'
                      : alert.severity === 'medium'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <AlertIcon type={alert.type} />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={alert.severity} />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <h3 className="font-medium mt-1">{alert.title}</h3>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      Affected:{' '}
                      <span className="font-mono text-foreground">{alert.affectedItem}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Type: <span className="capitalize">{alert.type.replace('-', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayedAlerts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {activeTab === 'active'
            ? 'No active alerts. All systems operational.'
            : 'No acknowledged alerts in history.'}
        </div>
      )}
    </div>
  )
}

function AlertIcon({ type }: { type: Alert['type'] }) {
  switch (type) {
    case 'stock-low':
      return <Package className="h-5 w-5" />
    case 'shipment-delayed':
      return <Truck className="h-5 w-5" />
    case 'reservation-conflict':
      return <GitBranch className="h-5 w-5" />
    default:
      return <AlertTriangle className="h-5 w-5" />
  }
}

function SeverityBadge({ severity }: { severity: Alert['severity'] }) {
  const config: Record<Alert['severity'], { label: string; className: string }> = {
    critical: { label: 'Critical', className: 'bg-destructive text-destructive-foreground' },
    high: { label: 'High', className: 'bg-destructive/80 text-destructive-foreground' },
    medium: { label: 'Medium', className: 'bg-warning text-warning-foreground' },
    low: { label: 'Low', className: 'bg-secondary text-secondary-foreground' },
  }
  const { label, className } = config[severity]
  return <Badge className={className}>{label}</Badge>
}
