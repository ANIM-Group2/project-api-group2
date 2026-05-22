import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { shipments, type ShipmentStatus, type ShipmentPriority } from '@/lib/logistics-data'
import { cn } from '@/lib/utils'

function getStatusColor(status: ShipmentStatus) {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'In transit':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'Delivered':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'Delayed':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    default:
      return ''
  }
}

function getPriorityColor(priority: ShipmentPriority) {
  switch (priority) {
    case 'standard':
      return 'bg-secondary text-secondary-foreground'
    case 'express':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    default:
      return ''
  }
}

export default function Shipments() {
  const [activeTab, setActiveTab] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredShipments = shipments.filter((shipment) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'inbound' && shipment.type === 'Inbound') ||
      (activeTab === 'outbound' && shipment.type === 'Outbound')
    const matchesPriority =
      priorityFilter === 'all' || shipment.priority === priorityFilter
    return matchesTab && matchesPriority
  })

  const inboundCount = shipments.filter((s) => s.type === 'Inbound').length
  const outboundCount = shipments.filter((s) => s.type === 'Outbound').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Shipments</h2>
          <p className="text-sm text-muted-foreground">
            {shipments.length} total shipments
          </p>
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="express">Express</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({shipments.length})</TabsTrigger>
          <TabsTrigger value="inbound">Inbound ({inboundCount})</TabsTrigger>
          <TabsTrigger value="outbound">Outbound ({outboundCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Shipment Info */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-medium">
                          {shipment.id}
                        </span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(shipment.status)}
                        >
                          {shipment.status}
                        </Badge>
                        <Badge variant="secondary">{shipment.type}</Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            getPriorityColor(shipment.priority),
                            'capitalize'
                          )}
                        >
                          {shipment.priority}
                        </Badge>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          {shipment.origin}
                        </span>
                        <ArrowRight className="size-4 text-muted-foreground" />
                        <span className="font-medium">{shipment.destination}</span>
                      </div>

                      {/* Items */}
                      <p className="text-sm text-muted-foreground">
                        {shipment.items}
                      </p>
                    </div>

                    {/* Right side info */}
                    <div className="flex flex-col items-start gap-1 lg:items-end lg:text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">ETA:</span>
                        <span
                          className={cn(
                            'text-sm font-medium',
                            shipment.status === 'Delayed' && 'text-red-500'
                          )}
                        >
                          {shipment.eta}
                          {shipment.status === 'Delayed' && ' (Overdue)'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {shipment.carrier}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredShipments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No shipments match the selected filters
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
