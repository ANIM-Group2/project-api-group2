'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Package,
  ClipboardList,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import {
  rawMaterials,
  shipments,
  reservations,
  alerts,
  getAvailableStock,
  getStockStatus,
} from '@/lib/logistics-data'

export function LogisticsDashboard() {
  const activeReservations = reservations.filter((r) => r.status === 'active')
  const shipmentsThisWeek = shipments.filter((s) => s.status !== 'delivered')
  const activeAlerts = alerts.filter((a) => !a.acknowledged)
  const criticalAlerts = activeAlerts.filter(
    (a) => a.severity === 'critical' || a.severity === 'high'
  )

  const materialsWithLowStock = rawMaterials.filter((m) => {
    const status = getStockStatus(m)
    return status === 'low' || status === 'critical'
  })

  const upcomingInbound = shipments
    .filter((s) => s.type === 'inbound' && s.status !== 'delivered')
    .slice(0, 3)
  const upcomingOutbound = shipments
    .filter((s) => s.type === 'outbound' && s.status !== 'delivered')
    .slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Alert banner for critical materials */}
      {criticalAlerts.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Active Alerts</span>
          </div>
          <ul className="space-y-1">
            {criticalAlerts.map((alert) => (
              <li key={alert.id} className="text-sm text-destructive/90">
                <span className="font-medium">{alert.affectedItem}:</span>{' '}
                {alert.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total SKUs in Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rawMaterials.length}</div>
            <p className="text-xs text-muted-foreground">
              {materialsWithLowStock.length} below threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Reservations
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReservations.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(activeReservations.map((r) => r.materialCode)).size} materials
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shipments This Week
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipmentsThisWeek.length}</div>
            <p className="text-xs text-muted-foreground">
              {shipments.filter((s) => s.type === 'inbound' && s.status !== 'delivered').length} inbound,{' '}
              {shipments.filter((s) => s.type === 'outbound' && s.status !== 'delivered').length} outbound
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical/high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock overview table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Safety Threshold</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rawMaterials.map((material) => {
                const available = getAvailableStock(material)
                const status = getStockStatus(material)
                return (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium font-mono text-sm">{material.code}</p>
                        <p className="text-xs text-muted-foreground">{material.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {material.currentStock.toLocaleString()} {material.unit}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {material.reserved.toLocaleString()} {material.unit}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {available.toLocaleString()} {material.unit}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {material.safetyThreshold.toLocaleString()} {material.unit}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === 'ok'
                            ? 'default'
                            : status === 'low'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className={
                          status === 'ok'
                            ? 'bg-success text-success-foreground'
                            : status === 'low'
                            ? 'bg-warning text-warning-foreground'
                            : ''
                        }
                      >
                        {status === 'ok' ? 'OK' : status === 'low' ? 'Low' : 'Critical'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Inbound */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4 text-success" />
                Inbound
              </h4>
              {upcomingInbound.map((shipment) => (
                <div
                  key={shipment.id}
                  className="rounded-lg border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{shipment.number}</span>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {shipment.origin} → {shipment.destination}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{shipment.carrier}</span>
                    <span>ETA: {shipment.eta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Outbound */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-primary" />
                Outbound
              </h4>
              {upcomingOutbound.map((shipment) => (
                <div
                  key={shipment.id}
                  className="rounded-lg border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{shipment.number}</span>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {shipment.origin} → {shipment.destination}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{shipment.carrier}</span>
                    <span>ETA: {shipment.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ShipmentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    scheduled: { label: 'Scheduled', className: 'bg-primary text-primary-foreground' },
    'in-transit': { label: 'In Transit', className: 'bg-warning text-warning-foreground' },
    delivered: { label: 'Delivered', className: 'bg-success text-success-foreground' },
    delayed: { label: 'Delayed', className: 'bg-destructive text-destructive-foreground' },
  }
  const { label, className } = config[status] || { label: status, className: '' }
  return <Badge className={className}>{label}</Badge>
}
