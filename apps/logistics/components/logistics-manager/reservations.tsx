'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import {
  rawMaterials,
  reservations as initialReservations,
  Reservation,
  getAvailableStock,
} from '@/lib/logistics-data'

export function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [newReservationOpen, setNewReservationOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [quantity, setQuantity] = useState('')
  const [productionOrder, setProductionOrder] = useState('')
  const [error, setError] = useState<string | null>(null)

  const activeReservations = reservations.filter((r) => r.status === 'active')

  // Calculate total reserved per material
  const reservedByMaterial = reservations
    .filter((r) => r.status === 'active')
    .reduce((acc, r) => {
      acc[r.materialCode] = (acc[r.materialCode] || 0) + r.quantity
      return acc
    }, {} as Record<string, number>)

  const handleNewReservation = () => {
    if (!selectedMaterial || !quantity || !productionOrder) {
      setError('Please fill all fields')
      return
    }

    const material = rawMaterials.find((m) => m.id === selectedMaterial)
    if (!material) return

    const requestedQty = parseFloat(quantity)
    const available = getAvailableStock(material)

    if (requestedQty > available) {
      setError(`Insufficient stock. Available: ${available.toLocaleString()} ${material.unit}`)
      return
    }

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      materialId: material.id,
      materialCode: material.code,
      productionOrder,
      quantity: requestedQty,
      reservedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    }

    setReservations([...reservations, newReservation])
    setNewReservationOpen(false)
    setSelectedMaterial('')
    setQuantity('')
    setProductionOrder('')
    setError(null)
  }

  const handleRelease = (id: string) => {
    setReservations(
      reservations.map((r) => (r.id === id ? { ...r, status: 'released' as const } : r))
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Reserved by Material</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(reservedByMaterial).map(([code, qty]) => {
              const material = rawMaterials.find((m) => m.code === code)
              return (
                <div key={code} className="rounded-lg border p-3 min-w-[140px]">
                  <p className="text-xs font-mono text-muted-foreground">{code}</p>
                  <p className="text-lg font-bold font-mono">
                    {qty.toLocaleString()} {material?.unit}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Active Reservations</h2>
        <Dialog open={newReservationOpen} onOpenChange={setNewReservationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Reservation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Reservation</DialogTitle>
              <DialogDescription>
                Reserve materials for a production order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label>Material</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {rawMaterials.map((m) => {
                      const available = getAvailableStock(m)
                      return (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="font-mono">{m.code}</span>
                          <span className="text-muted-foreground ml-2">
                            (Available: {available.toLocaleString()} {m.unit})
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Production Order</Label>
                <Input
                  placeholder="e.g., PO-2026-0155"
                  value={productionOrder}
                  onChange={(e) => setProductionOrder(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewReservationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleNewReservation}>Create Reservation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reservations table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reservation ID</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Production Order</TableHead>
                <TableHead className="text-right">Quantity Reserved</TableHead>
                <TableHead>Reserved At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeReservations.map((reservation) => {
                const material = rawMaterials.find((m) => m.id === reservation.materialId)
                return (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-mono text-sm">{reservation.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-mono font-medium">{reservation.materialCode}</p>
                        <p className="text-xs text-muted-foreground">
                          {material?.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{reservation.productionOrder}</TableCell>
                    <TableCell className="text-right font-mono">
                      {reservation.quantity.toLocaleString()} {material?.unit}
                    </TableCell>
                    <TableCell>{reservation.reservedAt}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          reservation.status === 'active'
                            ? 'bg-success text-success-foreground'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {reservation.status === 'active' ? 'Active' : 'Released'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {reservation.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRelease(reservation.id)}
                        >
                          Release
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
