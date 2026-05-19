'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, Check } from 'lucide-react'
import { shipments as initialShipments, Shipment } from '@/lib/logistics-data'

export function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments)
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('all')

  const filteredShipments = shipments.filter((shipment) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'inbound' && shipment.type === 'inbound') ||
      (activeTab === 'outbound' && shipment.type === 'outbound')
    const matchesPriority =
      priorityFilter === 'all' || shipment.priority === priorityFilter
    return matchesTab && matchesPriority
  })

  const handleMarkDelivered = (id: string) => {
    setShipments(
      shipments.map((s) => (s.id === id ? { ...s, status: 'delivered' as const } : s))
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="inbound">Inbound</TabsTrigger>
            <TabsTrigger value="outbound">Outbound</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[160px]">
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

      {/* Shipment cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{shipment.number}</span>
                    <Badge variant="outline" className="text-xs">
                      {shipment.type === 'inbound' ? 'Inbound' : 'Outbound'}
                    </Badge>
                  </div>
                  <ShipmentStatusBadge status={shipment.status} />
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground truncate max-w-[150px]">
                    {shipment.origin}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[150px]">{shipment.destination}</span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Carrier</p>
                    <p className="font-medium">{shipment.carrier}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">ETA</p>
                    <p className="font-medium font-mono">{shipment.eta}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Priority</p>
                    <PriorityBadge priority={shipment.priority} />
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-muted-foreground text-xs mb-2">Items</p>
                  <div className="space-y-1">
                    {shipment.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm bg-muted/50 rounded px-2 py-1"
                      >
                        <span className="font-mono">{item.code}</span>
                        <span className="text-muted-foreground">
                          {item.quantity.toLocaleString()} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {shipment.status === 'in-transit' && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleMarkDelivered(shipment.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No shipments match the selected filters.
        </div>
      )}
    </div>
  )
}

function ShipmentStatusBadge({ status }: { status: Shipment['status'] }) {
  const config: Record<Shipment['status'], { label: string; className: string }> = {
    scheduled: { label: 'Scheduled', className: 'bg-primary text-primary-foreground' },
    'in-transit': { label: 'In Transit', className: 'bg-warning text-warning-foreground' },
    delivered: { label: 'Delivered', className: 'bg-success text-success-foreground' },
    delayed: { label: 'Delayed', className: 'bg-destructive text-destructive-foreground' },
  }
  const { label, className } = config[status]
  return <Badge className={className}>{label}</Badge>
}

function PriorityBadge({ priority }: { priority: Shipment['priority'] }) {
  const config: Record<Shipment['priority'], { label: string; className: string }> = {
    standard: { label: 'Standard', className: 'bg-secondary text-secondary-foreground' },
    express: { label: 'Express', className: 'bg-warning text-warning-foreground' },
    critical: { label: 'Critical', className: 'bg-destructive text-destructive-foreground' },
  }
  const { label, className } = config[priority]
  return <Badge className={className}>{label}</Badge>
}
