import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { reservations, materials, type Reservation } from '@/lib/logistics-data'

export default function Reservations() {
  const [reservationsList, setReservationsList] = useState<Reservation[]>(reservations)
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [productionOrder, setProductionOrder] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState<string | null>(null)

  const activeReservations = reservationsList.filter((r) => r.status === 'active')

  const handleCreateReservation = () => {
    setError(null)

    if (!selectedMaterial || !productionOrder || !quantity) {
      setError('Please fill in all fields')
      return
    }

    const material = materials.find((m) => m.id === selectedMaterial)
    if (!material) {
      setError('Material not found')
      return
    }

    const requestedQty = parseFloat(quantity)
    const availableStock = material.stock - material.reserved

    if (requestedQty > availableStock) {
      setError(
        `Insufficient stock. Available: ${availableStock.toLocaleString()} ${material.unit}`
      )
      return
    }

    const newReservation: Reservation = {
      id: `RES-${String(reservationsList.length + 1).padStart(3, '0')}`,
      materialId: material.id,
      materialCode: material.code,
      productionOrder,
      quantity: requestedQty,
      unit: material.unit,
      reservedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    }

    setReservationsList([...reservationsList, newReservation])
    setIsNewReservationOpen(false)
    setSelectedMaterial('')
    setProductionOrder('')
    setQuantity('')
  }

  const handleReleaseReservation = (id: string) => {
    setReservationsList(
      reservationsList.map((r) =>
        r.id === id ? { ...r, status: 'released' as const } : r
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with New Reservation Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Material Reservations</h2>
          <p className="text-sm text-muted-foreground">
            {activeReservations.length} active reservations
          </p>
        </div>
        <Button onClick={() => setIsNewReservationOpen(true)}>
          <Plus className="mr-2 size-4" />
          New Reservation
        </Button>
      </div>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Production Order</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Reserved At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservationsList.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {reservation.id}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {reservation.materialCode}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {reservation.productionOrder}
                  </TableCell>
                  <TableCell className="text-right">
                    {reservation.quantity.toLocaleString()} {reservation.unit}
                  </TableCell>
                  <TableCell>{reservation.reservedAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        reservation.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {reservation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {reservation.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReleaseReservation(reservation.id)}
                      >
                        Release
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Reservation Dialog */}
      <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Reservation</DialogTitle>
            <DialogDescription>
              Create a new material reservation for a production order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="material">Material</Label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.code} — {material.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMaterial && (
                <p className="text-xs text-muted-foreground">
                  Available:{' '}
                  {(() => {
                    const m = materials.find((mat) => mat.id === selectedMaterial)
                    if (m) {
                      return `${(m.stock - m.reserved).toLocaleString()} ${m.unit}`
                    }
                    return 'N/A'
                  })()}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="production-order">Production Order</Label>
              <Input
                id="production-order"
                value={productionOrder}
                onChange={(e) => setProductionOrder(e.target.value)}
                placeholder="e.g., OF-2026-0060"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewReservationOpen(false)
                setError(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateReservation}>Create Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
