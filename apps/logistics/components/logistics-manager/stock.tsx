'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Plus, X } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  rawMaterials,
  RawMaterial,
  getAvailableStock,
  getStockStatus,
} from '@/lib/logistics-data'

export function StockPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null)
  const [movementDialogOpen, setMovementDialogOpen] = useState(false)

  const filteredMaterials = rawMaterials.filter((material) => {
    const matchesSearch =
      material.code.toLowerCase().includes(search.toLowerCase()) ||
      material.description.toLowerCase().includes(search.toLowerCase())
    const status = getStockStatus(material)
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Movement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Stock Movement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.code} - {m.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Movement Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry</SelectItem>
                      <SelectItem value="exit">Exit</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Optional notes..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMovementDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setMovementDialogOpen(false)}>
                  Add Movement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stock table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Safety</TableHead>
                <TableHead>Last Replenish</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => {
                const available = getAvailableStock(material)
                const status = getStockStatus(material)
                return (
                  <TableRow
                    key={material.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <TableCell className="font-mono font-medium">
                      {material.code}
                    </TableCell>
                    <TableCell>{material.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {material.supplier}
                    </TableCell>
                    <TableCell>{material.unit}</TableCell>
                    <TableCell className="text-right font-mono">
                      {material.currentStock.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {material.reserved.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {available.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {material.safetyThreshold.toLocaleString()}
                    </TableCell>
                    <TableCell>{material.lastReplenishment}</TableCell>
                    <TableCell>
                      <StatusBadge status={status} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Material detail sheet */}
      <Sheet open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedMaterial && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="font-mono">{selectedMaterial.code}</SheetTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMaterial(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                  <p className="mt-1">{selectedMaterial.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Supplier</h4>
                    <p className="mt-1">{selectedMaterial.supplier}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Unit</h4>
                    <p className="mt-1">{selectedMaterial.unit}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Current Stock</h4>
                    <p className="mt-1 font-mono text-lg">
                      {selectedMaterial.currentStock.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Reserved</h4>
                    <p className="mt-1 font-mono text-lg">
                      {selectedMaterial.reserved.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Available</h4>
                    <p className="mt-1 font-mono text-lg">
                      {getAvailableStock(selectedMaterial).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Safety Threshold</h4>
                    <p className="mt-1 font-mono text-lg">
                      {selectedMaterial.safetyThreshold.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">
                    <StatusBadge status={getStockStatus(selectedMaterial)} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Replenishment</h4>
                  <p className="mt-1">{selectedMaterial.lastReplenishment}</p>
                </div>

                {/* Stock history chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Stock History (Last 6 Months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedMaterial.stockHistory}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12 }}
                            className="text-muted-foreground"
                          />
                          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="stock"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function StatusBadge({ status }: { status: 'ok' | 'low' | 'critical' }) {
  const config = {
    ok: { label: 'OK', className: 'bg-success text-success-foreground' },
    low: { label: 'Low', className: 'bg-warning text-warning-foreground' },
    critical: { label: 'Critical', className: 'bg-destructive text-destructive-foreground' },
  }
  const { label, className } = config[status]
  return <Badge className={className}>{label}</Badge>
}
