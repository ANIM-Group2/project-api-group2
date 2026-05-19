'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { shipments, type Shipment } from '@/lib/mock-data'
import {
  Search,
  Plus,
  Truck,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
} from 'lucide-react'

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-muted text-muted-foreground', icon: Clock },
  in_transit: { label: 'In Transit', color: 'bg-chart-1/20 text-chart-1', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-accent/20 text-accent', icon: CheckCircle2 },
  delayed: { label: 'Delayed', color: 'bg-destructive/20 text-destructive', icon: AlertTriangle },
}

const priorityConfig = {
  standard: { label: 'Standard', color: 'bg-muted text-muted-foreground' },
  express: { label: 'Express', color: 'bg-chart-3/20 text-chart-3' },
  critical: { label: 'Critical', color: 'bg-destructive/20 text-destructive' },
}

export function LogisticsDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    const matchesType = typeFilter === 'all' || shipment.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const inboundShipments = filteredShipments.filter((s) => s.type === 'inbound')
  const outboundShipments = filteredShipments.filter((s) => s.type === 'outbound')

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in_transit').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    delayed: shipments.filter((s) => s.status === 'delayed').length,
    inbound: shipments.filter((s) => s.type === 'inbound').length,
    outbound: shipments.filter((s) => s.type === 'outbound').length,
  }

  const ShipmentCard = ({ shipment }: { shipment: Shipment }) => {
    const StatusIcon = statusConfig[shipment.status].icon
    const isInbound = shipment.type === 'inbound'

    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {isInbound ? (
              <ArrowDownLeft className="h-4 w-4 text-chart-2" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-chart-1" />
            )}
            <span className="font-mono text-sm font-medium">{shipment.shipmentNumber}</span>
          </div>
          <Badge className={statusConfig[shipment.status].color} variant="secondary">
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusConfig[shipment.status].label}
          </Badge>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1 space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">From: </span>
                <span className="font-medium">{shipment.origin.split(' - ')[0]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">To: </span>
                <span className="font-medium">{shipment.destination.split(' - ')[0]}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span>{shipment.carrier}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              ETA: <span className="font-medium">{shipment.estimatedArrival}</span>
              {shipment.actualArrival && (
                <span className="ml-2 text-accent">
                  (Delivered: {shipment.actualArrival})
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>
              {shipment.items.length} item{shipment.items.length !== 1 ? 's' : ''} •{' '}
              {shipment.items.reduce((acc, item) => acc + item.quantity, 0)} units
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge className={priorityConfig[shipment.priority].color} variant="secondary">
            {priorityConfig[shipment.priority].label}
          </Badge>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shipments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">{stats.inTransit}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
                <Truck className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{stats.delivered}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold">{stats.delayed}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flow Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                <ArrowDownLeft className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inbound Shipments</p>
                <p className="text-3xl font-bold">{stats.inbound}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/20">
                <ArrowUpRight className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outbound Shipments</p>
                <p className="text-3xl font-bold">{stats.outbound}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Shipment Management</CardTitle>
              <CardDescription>Track inbound and outbound logistics</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search shipments, carriers, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({filteredShipments.length})</TabsTrigger>
              <TabsTrigger value="inbound">Inbound ({inboundShipments.length})</TabsTrigger>
              <TabsTrigger value="outbound">Outbound ({outboundShipments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredShipments.map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inbound">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inboundShipments.map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="outbound">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {outboundShipments.map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
