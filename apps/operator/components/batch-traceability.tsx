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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { batches, type Batch } from '@/lib/mock-data'
import {
  Search,
  Layers,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Link2,
  FileText,
  ArrowRight,
  Package,
  Factory,
  Truck,
} from 'lucide-react'

const statusConfig = {
  active: { label: 'Active', color: 'bg-chart-1/20 text-chart-1', icon: Factory },
  quarantine: { label: 'Quarantine', color: 'bg-destructive/20 text-destructive', icon: AlertTriangle },
  released: { label: 'Released', color: 'bg-accent/20 text-accent', icon: CheckCircle2 },
  recalled: { label: 'Recalled', color: 'bg-chart-4/20 text-chart-4', icon: AlertTriangle },
}

export function BatchTraceability() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: batches.length,
    active: batches.filter((b) => b.status === 'active').length,
    released: batches.filter((b) => b.status === 'released').length,
    quarantine: batches.filter((b) => b.status === 'quarantine').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
                <Factory className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Released</p>
                <p className="text-2xl font-bold">{stats.released}</p>
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
                <p className="text-sm text-muted-foreground">Quarantine</p>
                <p className="text-2xl font-bold">{stats.quarantine}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch List */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Batch Traceability</CardTitle>
              <CardDescription>Track materials, production, and shipments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search batch number, product, part number..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="quarantine">Quarantine</SelectItem>
                <SelectItem value="recalled">Recalled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Batch Cards */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredBatches.map((batch) => {
              const StatusIcon = statusConfig[batch.status].icon
              return (
                <Dialog key={batch.id}>
                  <DialogTrigger asChild>
                    <div
                      className="cursor-pointer rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" />
                            <p className="font-mono text-sm font-medium">{batch.batchNumber}</p>
                          </div>
                          <p className="mt-1 text-sm font-medium">{batch.product}</p>
                          <p className="text-xs text-muted-foreground">{batch.partNumber}</p>
                        </div>
                        <Badge className={statusConfig[batch.status].color} variant="secondary">
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[batch.status].label}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium">{batch.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Manufactured</p>
                          <p className="font-medium">{batch.manufacturedDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Certifications</p>
                          <p className="font-medium">{batch.qualityCerts.length}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1">
                        {batch.qualityCerts.slice(0, 3).map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            <Shield className="mr-1 h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                        {batch.qualityCerts.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{batch.qualityCerts.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Batch Traceability Details</DialogTitle>
                      <DialogDescription>
                        {batch.batchNumber} - {batch.product}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Batch Info */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Part Number</p>
                          <p className="font-mono text-sm font-medium">{batch.partNumber}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="text-sm font-medium">{batch.quantity} units</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Manufactured</p>
                          <p className="text-sm font-medium">{batch.manufacturedDate}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge className={`mt-1 ${statusConfig[batch.status].color}`}>
                            {statusConfig[batch.status].label}
                          </Badge>
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                          <Shield className="h-4 w-4" />
                          Quality Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {batch.qualityCerts.map((cert) => (
                            <Badge key={cert} variant="outline">
                              <FileText className="mr-1 h-3 w-3" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Traceability Chain */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                          <Link2 className="h-4 w-4" />
                          Traceability Chain
                        </h4>
                        <div className="space-y-4">
                          {/* Raw Materials */}
                          <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Package className="h-4 w-4 text-chart-1" />
                              Raw Materials
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {batch.traceability.rawMaterials.map((rm) => (
                                <Badge key={rm} variant="secondary" className="font-mono">
                                  {rm}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>

                          {/* Production Orders */}
                          <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Factory className="h-4 w-4 text-chart-2" />
                              Production Orders
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {batch.traceability.productionOrders.map((po) => (
                                <Badge key={po} variant="secondary" className="font-mono">
                                  {po}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>

                          {/* Shipments */}
                          <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Truck className="h-4 w-4 text-chart-3" />
                              Shipments
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {batch.traceability.shipments.length > 0 ? (
                                batch.traceability.shipments.map((sh) => (
                                  <Badge key={sh} variant="secondary" className="font-mono">
                                    {sh}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No shipments yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
