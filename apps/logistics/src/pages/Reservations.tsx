// import { useState } from 'react'
// import { Plus } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { reservations, materials, type Reservation } from '@/lib/logistics-data'

// export default function Reservations() {
//   const [reservationsList, setReservationsList] = useState<Reservation[]>(reservations)
//   const [isNewReservationOpen, setIsNewReservationOpen] = useState(false)
//   const [selectedMaterial, setSelectedMaterial] = useState<string>('')
//   const [productionOrder, setProductionOrder] = useState('')
//   const [quantity, setQuantity] = useState('')
//   const [error, setError] = useState<string | null>(null)

//   const activeReservations = reservationsList.filter((r) => r.status === 'active')

//   const handleCreateReservation = () => {
//     setError(null)

//     if (!selectedMaterial || !productionOrder || !quantity) {
//       setError('Please fill in all fields')
//       return
//     }

//     const material = materials.find((m) => m.id === selectedMaterial)
//     if (!material) {
//       setError('Material not found')
//       return
//     }

//     const requestedQty = parseFloat(quantity)
//     const availableStock = material.stock - material.reserved

//     if (requestedQty > availableStock) {
//       setError(
//         `Insufficient stock. Available: ${availableStock.toLocaleString()} ${material.unit}`
//       )
//       return
//     }

//     const newReservation: Reservation = {
//       id: `RES-${String(reservationsList.length + 1).padStart(3, '0')}`,
//       materialId: material.id,
//       materialCode: material.code,
//       productionOrder,
//       quantity: requestedQty,
//       unit: material.unit,
//       reservedAt: new Date().toISOString().split('T')[0],
//       status: 'active',
//     }

//     setReservationsList([...reservationsList, newReservation])
//     setIsNewReservationOpen(false)
//     setSelectedMaterial('')
//     setProductionOrder('')
//     setQuantity('')
//   }

//   const handleReleaseReservation = (id: string) => {
//     setReservationsList(
//       reservationsList.map((r) =>
//         r.id === id ? { ...r, status: 'released' as const } : r
//       )
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with New Reservation Button */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-semibold">Material Reservations</h2>
//           <p className="text-sm text-muted-foreground">
//             {activeReservations.length} active reservations
//           </p>
//         </div>
//         <Button onClick={() => setIsNewReservationOpen(true)}>
//           <Plus className="mr-2 size-4" />
//           New Reservation
//         </Button>
//       </div>

//       {/* Reservations Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Reservations</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Material</TableHead>
//                 <TableHead>Production Order</TableHead>
//                 <TableHead className="text-right">Quantity</TableHead>
//                 <TableHead>Reserved At</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {reservationsList.map((reservation) => (
//                 <TableRow key={reservation.id}>
//                   <TableCell className="font-mono text-sm font-medium">
//                     {reservation.id}
//                   </TableCell>
//                   <TableCell className="font-mono text-sm">
//                     {reservation.materialCode}
//                   </TableCell>
//                   <TableCell className="font-mono text-sm">
//                     {reservation.productionOrder}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {reservation.quantity.toLocaleString()} {reservation.unit}
//                   </TableCell>
//                   <TableCell>{reservation.reservedAt}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant="outline"
//                       className={
//                         reservation.status === 'active'
//                           ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
//                           : 'bg-muted text-muted-foreground'
//                       }
//                     >
//                       {reservation.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {reservation.status === 'active' && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleReleaseReservation(reservation.id)}
//                       >
//                         Release
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* New Reservation Dialog */}
//       <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>New Reservation</DialogTitle>
//             <DialogDescription>
//               Create a new material reservation for a production order.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             {error && (
//               <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
//                 {error}
//               </div>
//             )}
//             <div className="grid gap-2">
//               <Label htmlFor="material">Material</Label>
//               <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
//                 <SelectTrigger id="material">
//                   <SelectValue placeholder="Select material" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {materials.map((material) => (
//                     <SelectItem key={material.id} value={material.id}>
//                       {material.code} — {material.description}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {selectedMaterial && (
//                 <p className="text-xs text-muted-foreground">
//                   Available:{' '}
//                   {(() => {
//                     const m = materials.find((mat) => mat.id === selectedMaterial)
//                     if (m) {
//                       return `${(m.stock - m.reserved).toLocaleString()} ${m.unit}`
//                     }
//                     return 'N/A'
//                   })()}
//                 </p>
//               )}
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="production-order">Production Order</Label>
//               <Input
//                 id="production-order"
//                 value={productionOrder}
//                 onChange={(e) => setProductionOrder(e.target.value)}
//                 placeholder="e.g., OF-2026-0060"
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="quantity">Quantity</Label>
//               <Input
//                 id="quantity"
//                 type="number"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 placeholder="Enter quantity"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsNewReservationOpen(false)
//                 setError(null)
//               }}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleCreateReservation}>Create Reservation</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }




import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { reservationsApi, stockApi, productionOrdersApi, type MaterialReservation, type RawMaterial, type ProductionOrder } from '@/lib/api'

export default function Reservations() {
  const [reservations, setReservations] = useState<MaterialReservation[]>([])
  const [materials,    setMaterials]    = useState<RawMaterial[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [isOpen,       setIsOpen]       = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [releasing,    setReleasing]    = useState<number | null>(null)
  const [formError,    setFormError]    = useState<string | null>(null)

  const [matId,  setMatId]  = useState('')
  const [orderId,setOrderId]= useState('')
  const [qty,    setQty]    = useState('')
  const [prodOrders, setProdOrders] = useState<ProductionOrder[]>([])

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [res, mats, prods] = await Promise.all([reservationsApi.getAll(), stockApi.getAll(), productionOrdersApi.getAll()])
      setReservations(res)
      setMaterials(mats)
      setProdOrders(prods ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    setFormError(null)
    if (!matId || !orderId || !qty) { setFormError('Please fill in all fields'); return }
    const mat = materials.find(m => m.material_id === Number(matId))
    if (!mat) { setFormError('Material not found'); return }
    const available = mat.stock_quantity - mat.reserved_quantity
    if (Number(qty) > available) {
      setFormError(`Insufficient stock. Available: ${available.toLocaleString()} ${mat.unit}`)
      return
    }
    try {
      setSubmitting(true)
      await reservationsApi.create(Number(matId), Number(orderId), Number(qty))
      await load()
      setIsOpen(false)
      setMatId(''); setOrderId(''); setQty('')
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Failed to create reservation')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRelease(id: number) {
    try {
      setReleasing(id)
      await reservationsApi.release(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to release')
    } finally {
      setReleasing(null)
    }
  }

  const active = reservations.filter(r => r.is_active)

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
  if (error) return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
  )

  const selectedMat = materials.find(m => m.material_id === Number(matId))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Material Reservations</h2>
          <p className="text-sm text-muted-foreground">{active.length} active reservations</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 size-4" /> New Reservation
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Reservations</CardTitle></CardHeader>
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
              {reservations.map(r => (
                <TableRow key={r.reservation_id}>
                  <TableCell className="font-mono text-sm font-medium">{r.reservation_id}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {r.material?.reference ?? `#${r.material_id}`}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {prodOrders.find(p => p.production_order_id === r.production_order_id)?.order_number ?? `#${r.production_order_id}`}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.quantity_reserved.toLocaleString()} {r.material?.unit ?? ''}
                  </TableCell>
                  <TableCell>{r.reserved_at?.split('T')[0]}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      r.is_active
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground'
                    }>
                      {r.is_active ? 'active' : 'released'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.is_active && (
                      <Button variant="outline" size="sm"
                        disabled={releasing === r.reservation_id}
                        onClick={() => handleRelease(r.reservation_id)}>
                        {releasing === r.reservation_id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Release'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {reservations.length === 0 && <p className="py-12 text-center text-muted-foreground">No reservations found</p>}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Reservation</DialogTitle>
            <DialogDescription>Reserve material for a production order.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>
            )}
            <div className="grid gap-2">
              <Label>Material</Label>
              <Select value={matId} onValueChange={setMatId}>
                <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                <SelectContent>
                  {materials.map(m => (
                    <SelectItem key={m.material_id} value={String(m.material_id)}>
                      {m.reference} — {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMat && (
                <p className="text-xs text-muted-foreground">
                  Available: {(selectedMat.stock_quantity - selectedMat.reserved_quantity).toLocaleString()} {selectedMat.unit}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Production Order</Label>
              <Select value={orderId} onValueChange={setOrderId}>
                <SelectTrigger><SelectValue placeholder="Select production order" /></SelectTrigger>
                <SelectContent>
                  {prodOrders.filter(p => p.status !== 'completed' && p.status !== 'cancelled').map(p => (
                    <SelectItem key={p.production_order_id} value={String(p.production_order_id)}>
                      {p.order_number} — {p.product?.name ?? 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Quantity {selectedMat ? `(${selectedMat.unit})` : ''}</Label>
              <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Enter quantity" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsOpen(false); setFormError(null) }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}