// import { useState } from 'react'
// import { Search, Plus } from 'lucide-react'
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from '@/components/ui/sheet'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { materials, type Material, type MaterialStatus } from '@/lib/logistics-data'
// import { cn } from '@/lib/utils'

// function getStatusColor(status: MaterialStatus) {
//   switch (status) {
//     case 'OK':
//       return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
//     case 'Low':
//       return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
//     case 'Critical':
//       return 'bg-red-500/10 text-red-500 border-red-500/20'
//     default:
//       return ''
//   }
// }

// export default function Stock() {
//   const [search, setSearch] = useState('')
//   const [statusFilter, setStatusFilter] = useState<string>('all')
//   const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
//   const [isSheetOpen, setIsSheetOpen] = useState(false)
//   const [isAddMovementOpen, setIsAddMovementOpen] = useState(false)
//   const [movementType, setMovementType] = useState<string>('entry')
//   const [movementQuantity, setMovementQuantity] = useState('')
//   const [movementNotes, setMovementNotes] = useState('')

//   const filteredMaterials = materials.filter((material) => {
//     const matchesSearch =
//       material.code.toLowerCase().includes(search.toLowerCase()) ||
//       material.description.toLowerCase().includes(search.toLowerCase())
//     const matchesStatus =
//       statusFilter === 'all' || material.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const handleRowClick = (material: Material) => {
//     setSelectedMaterial(material)
//     setIsSheetOpen(true)
//   }

//   const handleAddMovement = () => {
//     // In a real app, this would update the database
//     console.log('Adding movement:', { movementType, movementQuantity, movementNotes })
//     setIsAddMovementOpen(false)
//     setMovementType('entry')
//     setMovementQuantity('')
//     setMovementNotes('')
//   }

//   return (
//     <div className="space-y-6">
//       {/* Search and Filters */}
//       <Card>
//         <CardContent className="py-4">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search materials..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//             <div className="flex gap-2">
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-32">
//                   <SelectValue placeholder="Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="OK">OK</SelectItem>
//                   <SelectItem value="Low">Low</SelectItem>
//                   <SelectItem value="Critical">Critical</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Inventory Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Inventory</CardTitle>
//           <CardDescription>
//             Click on a row to view detailed information
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Material Code</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead>Supplier</TableHead>
//                 <TableHead className="text-right">Current Stock</TableHead>
//                 <TableHead className="text-right">Reserved</TableHead>
//                 <TableHead className="text-right">Available</TableHead>
//                 <TableHead className="text-right">Safety Threshold</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredMaterials.map((material) => (
//                 <TableRow
//                   key={material.id}
//                   className="cursor-pointer"
//                   onClick={() => handleRowClick(material)}
//                 >
//                   <TableCell className="font-mono text-sm font-medium">
//                     {material.code}
//                   </TableCell>
//                   <TableCell>{material.description}</TableCell>
//                   <TableCell className="text-muted-foreground">
//                     {material.supplier}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {material.stock.toLocaleString()} {material.unit}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {material.reserved.toLocaleString()} {material.unit}
//                   </TableCell>
//                   <TableCell className="text-right font-medium">
//                     {(material.stock - material.reserved).toLocaleString()}{' '}
//                     {material.unit}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {material.safetyThreshold.toLocaleString()} {material.unit}
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant="outline"
//                       className={getStatusColor(material.status)}
//                     >
//                       {material.status}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Material Detail Sheet */}
//       <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
//         <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
//           {selectedMaterial && (
//             <>
//               <SheetHeader>
//                 <SheetTitle>{selectedMaterial.code}</SheetTitle>
//                 <SheetDescription>{selectedMaterial.description}</SheetDescription>
//               </SheetHeader>

//               <div className="mt-6 space-y-6">
//                 {/* Material Details */}
//                 <div className="grid gap-4">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Supplier</span>
//                     <span className="text-sm font-medium">
//                       {selectedMaterial.supplier}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">
//                       Current Stock
//                     </span>
//                     <span className="text-sm font-medium">
//                       {selectedMaterial.stock.toLocaleString()} {selectedMaterial.unit}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Reserved</span>
//                     <span className="text-sm font-medium">
//                       {selectedMaterial.reserved.toLocaleString()}{' '}
//                       {selectedMaterial.unit}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Available</span>
//                     <span className="text-sm font-medium">
//                       {(
//                         selectedMaterial.stock - selectedMaterial.reserved
//                       ).toLocaleString()}{' '}
//                       {selectedMaterial.unit}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">
//                       Safety Threshold
//                     </span>
//                     <span className="text-sm font-medium">
//                       {selectedMaterial.safetyThreshold.toLocaleString()}{' '}
//                       {selectedMaterial.unit}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-muted-foreground">Status</span>
//                     <Badge
//                       variant="outline"
//                       className={getStatusColor(selectedMaterial.status)}
//                     >
//                       {selectedMaterial.status}
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Stock History Chart */}
//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium">Stock History (6 Months)</h4>
//                   <div className="h-48 w-full">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={selectedMaterial.stockHistory}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                         <XAxis
//                           dataKey="month"
//                           stroke="hsl(var(--muted-foreground))"
//                           fontSize={12}
//                         />
//                         <YAxis
//                           stroke="hsl(var(--muted-foreground))"
//                           fontSize={12}
//                         />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: 'hsl(var(--card))',
//                             border: '1px solid hsl(var(--border))',
//                             borderRadius: '8px',
//                           }}
//                           labelStyle={{ color: 'hsl(var(--foreground))' }}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="stock"
//                           stroke="hsl(var(--primary))"
//                           strokeWidth={2}
//                           dot={{ fill: 'hsl(var(--primary))' }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Add Movement Button */}
//                 <Button
//                   onClick={() => setIsAddMovementOpen(true)}
//                   className="w-full"
//                 >
//                   <Plus className="mr-2 size-4" />
//                   Add Stock Movement
//                 </Button>
//               </div>
//             </>
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* Add Movement Dialog */}
//       <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Stock Movement</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="movement-type">Type</Label>
//               <Select value={movementType} onValueChange={setMovementType}>
//                 <SelectTrigger id="movement-type">
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="entry">Entry</SelectItem>
//                   <SelectItem value="exit">Exit</SelectItem>
//                   <SelectItem value="adjustment">Adjustment</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="quantity">Quantity</Label>
//               <Input
//                 id="quantity"
//                 type="number"
//                 value={movementQuantity}
//                 onChange={(e) => setMovementQuantity(e.target.value)}
//                 placeholder={`Enter quantity in ${selectedMaterial?.unit || 'units'}`}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="notes">Notes</Label>
//               <Input
//                 id="notes"
//                 value={movementNotes}
//                 onChange={(e) => setMovementNotes(e.target.value)}
//                 placeholder="Optional notes"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsAddMovementOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddMovement}>Add Movement</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { Search, Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { stockApi, type RawMaterial, type StockMovement } from '@/lib/api'
import { cn } from '@/lib/utils'

function getStockStatus(m: RawMaterial) {
  const avail = m.stock_quantity - m.reserved_quantity
  if (avail <= 0 || avail < m.safety_threshold * 0.5) return 'Critical'
  if (avail < m.safety_threshold) return 'Low'
  return 'OK'
}
function getStatusColor(status: string) {
  if (status === 'OK')       return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  if (status === 'Low')      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  if (status === 'Critical') return 'bg-red-500/10 text-red-500 border-red-500/20'
  return ''
}

export default function Stock() {
  const [materials,  setMaterials]  = useState<RawMaterial[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState('all')

  const [selected,   setSelected]   = useState<RawMaterial | null>(null)
  const [sheetOpen,  setSheetOpen]  = useState(false)
  const [log,        setLog]        = useState<StockMovement[]>([])
  const [logLoading, setLogLoading] = useState(false)

  const [adjOpen,    setAdjOpen]    = useState(false)
  const [adjType,    setAdjType]    = useState('in')
  const [adjQty,     setAdjQty]     = useState('')
  const [adjReason,  setAdjReason]  = useState('')
  const [adjRef,     setAdjRef]     = useState('')
  const [adjSaving,  setAdjSaving]  = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      setMaterials(await stockApi.getAll())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load stock')
    } finally {
      setLoading(false)
    }
  }

  async function openDetail(m: RawMaterial) {
    setSelected(m)
    setSheetOpen(true)
    setLogLoading(true)
    try {
      setLog(await stockApi.getLog(m.material_id))
    } catch { setLog([]) }
    finally { setLogLoading(false) }
  }

  async function handleAdjust() {
    if (!selected || !adjQty) return
    try {
      setAdjSaving(true)
      const delta = adjType === 'out' ? -Math.abs(Number(adjQty)) : Math.abs(Number(adjQty))
      await stockApi.adjust(selected.material_id, delta, adjReason, adjRef)
      await load()
      setAdjOpen(false)
      setAdjQty(''); setAdjReason(''); setAdjRef('')
      // refresh sheet data
      const updated = await stockApi.getAll()
      const fresh = updated.find(m => m.material_id === selected.material_id)
      if (fresh) setSelected(fresh)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Adjustment failed')
    } finally {
      setAdjSaving(false)
    }
  }

  const filtered = materials.filter(m => {
    const matchSearch = m.reference.toLowerCase().includes(search.toLowerCase()) ||
                        m.name.toLowerCase().includes(search.toLowerCase())
    const status = getStockStatus(m)
    const matchFilter = filter === 'all' || status === filter
    return matchSearch && matchFilter
  })

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
  if (error) return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search materials..." value={search}
                onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="OK">OK</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Click on a row to view details and movement history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Safety</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => {
                const status = getStockStatus(m)
                const avail  = m.stock_quantity - m.reserved_quantity
                return (
                  <TableRow key={m.material_id} className="cursor-pointer" onClick={() => openDetail(m)}>
                    <TableCell className="font-mono text-sm font-medium">{m.reference}</TableCell>
                    <TableCell>{m.name}</TableCell>
                    <TableCell className="text-muted-foreground">{m.supplier?.company_name ?? '—'}</TableCell>
                    <TableCell className="text-right">{m.stock_quantity.toLocaleString()} {m.unit}</TableCell>
                    <TableCell className="text-right">{m.reserved_quantity.toLocaleString()} {m.unit}</TableCell>
                    <TableCell className="text-right font-medium">{avail.toLocaleString()} {m.unit}</TableCell>
                    <TableCell className="text-right">{m.safety_threshold.toLocaleString()} {m.unit}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(status)}>{status}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">No materials found</p>}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.reference}</SheetTitle>
                <SheetDescription>{selected.name}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="grid gap-3 text-sm">
                  {[
                    ['Supplier',         selected.supplier?.company_name ?? '—'],
                    ['Current Stock',    `${selected.stock_quantity.toLocaleString()} ${selected.unit}`],
                    ['Reserved',         `${selected.reserved_quantity.toLocaleString()} ${selected.unit}`],
                    ['Available',        `${(selected.stock_quantity - selected.reserved_quantity).toLocaleString()} ${selected.unit}`],
                    ['Safety Threshold', `${selected.safety_threshold.toLocaleString()} ${selected.unit}`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Movement log */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Recent Movements</h4>
                  {logLoading
                    ? <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                    : log.length === 0
                      ? <p className="text-sm text-muted-foreground">No movements recorded</p>
                      : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {log.slice(0, 10).map(l => (
                            <div key={l._id} className="flex justify-between text-xs border rounded p-2">
                              <div>
                                <span className={cn('font-medium capitalize',
                                  l.movement_type === 'in' ? 'text-emerald-500' : 'text-red-400')}>
                                  {l.movement_type}
                                </span>
                                {l.reason && <span className="ml-2 text-muted-foreground">{l.reason}</span>}
                              </div>
                              <div className="text-right">
                                <span className="font-medium">{l.quantity > 0 ? '+' : ''}{l.quantity}</span>
                                <span className="ml-2 text-muted-foreground">{new Date(l.performed_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                  }
                </div>

                <Button className="w-full" onClick={() => setAdjOpen(true)}>
                  <Plus className="mr-2 size-4" /> Add Stock Movement
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Adjust Dialog */}
      <Dialog open={adjOpen} onOpenChange={setAdjOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Stock Movement</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={adjType} onValueChange={setAdjType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Entry (in)</SelectItem>
                  <SelectItem value="out">Exit (out)</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Quantity ({selected?.unit})</Label>
              <Input type="number" value={adjQty} onChange={e => setAdjQty(e.target.value)} placeholder="Enter quantity" />
            </div>
            <div className="grid gap-2">
              <Label>Reason</Label>
              <Input value={adjReason} onChange={e => setAdjReason(e.target.value)} placeholder="e.g. Supplier delivery" />
            </div>
            <div className="grid gap-2">
              <Label>Reference doc</Label>
              <Input value={adjRef} onChange={e => setAdjRef(e.target.value)} placeholder="e.g. DEL-2026-001" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjOpen(false)}>Cancel</Button>
            <Button onClick={handleAdjust} disabled={!adjQty || adjSaving}>
              {adjSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Movement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}