import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { materials, type Material, type MaterialStatus } from '@/lib/logistics-data'
import { cn } from '@/lib/utils'

function getStatusColor(status: MaterialStatus) {
  switch (status) {
    case 'OK':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'Low':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'Critical':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    default:
      return ''
  }
}

export default function Stock() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false)
  const [movementType, setMovementType] = useState<string>('entry')
  const [movementQuantity, setMovementQuantity] = useState('')
  const [movementNotes, setMovementNotes] = useState('')

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.code.toLowerCase().includes(search.toLowerCase()) ||
      material.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || material.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleRowClick = (material: Material) => {
    setSelectedMaterial(material)
    setIsSheetOpen(true)
  }

  const handleAddMovement = () => {
    // In a real app, this would update the database
    console.log('Adding movement:', { movementType, movementQuantity, movementNotes })
    setIsAddMovementOpen(false)
    setMovementType('entry')
    setMovementQuantity('')
    setMovementNotes('')
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="OK">OK</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            Click on a row to view detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Safety Threshold</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow
                  key={material.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(material)}
                >
                  <TableCell className="font-mono text-sm font-medium">
                    {material.code}
                  </TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {material.supplier}
                  </TableCell>
                  <TableCell className="text-right">
                    {material.stock.toLocaleString()} {material.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    {material.reserved.toLocaleString()} {material.unit}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {(material.stock - material.reserved).toLocaleString()}{' '}
                    {material.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    {material.safetyThreshold.toLocaleString()} {material.unit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(material.status)}
                    >
                      {material.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Material Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedMaterial && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedMaterial.code}</SheetTitle>
                <SheetDescription>{selectedMaterial.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Material Details */}
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Supplier</span>
                    <span className="text-sm font-medium">
                      {selectedMaterial.supplier}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current Stock
                    </span>
                    <span className="text-sm font-medium">
                      {selectedMaterial.stock.toLocaleString()} {selectedMaterial.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reserved</span>
                    <span className="text-sm font-medium">
                      {selectedMaterial.reserved.toLocaleString()}{' '}
                      {selectedMaterial.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Available</span>
                    <span className="text-sm font-medium">
                      {(
                        selectedMaterial.stock - selectedMaterial.reserved
                      ).toLocaleString()}{' '}
                      {selectedMaterial.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Safety Threshold
                    </span>
                    <span className="text-sm font-medium">
                      {selectedMaterial.safetyThreshold.toLocaleString()}{' '}
                      {selectedMaterial.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedMaterial.status)}
                    >
                      {selectedMaterial.status}
                    </Badge>
                  </div>
                </div>

                {/* Stock History Chart */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Stock History (6 Months)</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedMaterial.stockHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
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
                </div>

                {/* Add Movement Button */}
                <Button
                  onClick={() => setIsAddMovementOpen(true)}
                  className="w-full"
                >
                  <Plus className="mr-2 size-4" />
                  Add Stock Movement
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Movement Dialog */}
      <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock Movement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="movement-type">Type</Label>
              <Select value={movementType} onValueChange={setMovementType}>
                <SelectTrigger id="movement-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry</SelectItem>
                  <SelectItem value="exit">Exit</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={movementQuantity}
                onChange={(e) => setMovementQuantity(e.target.value)}
                placeholder={`Enter quantity in ${selectedMaterial?.unit || 'units'}`}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={movementNotes}
                onChange={(e) => setMovementNotes(e.target.value)}
                placeholder="Optional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMovementOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMovement}>Add Movement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
