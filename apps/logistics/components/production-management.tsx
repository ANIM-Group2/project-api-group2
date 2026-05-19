'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { productionOrders, type ProductionOrder } from '@/lib/mock-data'
import {
  Search,
  Filter,
  Plus,
  Eye,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Calendar,
  Users,
  Wrench,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-muted text-muted-foreground', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-chart-1/20 text-chart-1', icon: Play },
  quality_check: { label: 'Quality Check', color: 'bg-chart-3/20 text-chart-3', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-accent/20 text-accent', icon: CheckCircle2 },
  on_hold: { label: 'On Hold', color: 'bg-destructive/20 text-destructive', icon: Pause },
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-chart-3/20 text-chart-3' },
  high: { label: 'High', color: 'bg-chart-4/20 text-chart-4' },
  critical: { label: 'Critical', color: 'bg-destructive/20 text-destructive' },
}

export function ProductionManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null)

  const filteredOrders = productionOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: productionOrders.length,
    inProgress: productionOrders.filter((o) => o.status === 'in_progress').length,
    completed: productionOrders.filter((o) => o.status === 'completed').length,
    onHold: productionOrders.filter((o) => o.status === 'on_hold').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
                <Play className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
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
                <p className="text-sm text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold">{stats.onHold}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Production Orders</CardTitle>
              <CardDescription>Manage and track manufacturing orders</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders, products, part numbers..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="quality_check">Quality Check</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{order.partNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{order.product}</p>
                          <p className="text-xs text-muted-foreground">{order.workstation}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={(order.completed / order.quantity) * 100}
                            className="h-2 w-20"
                          />
                          <span className="text-sm text-muted-foreground">
                            {order.completed}/{order.quantity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityConfig[order.priority].color} variant="secondary">
                          {priorityConfig[order.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[order.status].color} variant="secondary">
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.dueDate}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DialogTrigger asChild>
                                <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Start Production
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Put On Hold
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Production Order Details</DialogTitle>
                              <DialogDescription>
                                {selectedOrder?.orderNumber} - {selectedOrder?.product}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Part Number</p>
                                    <p className="font-mono font-medium">{selectedOrder.partNumber}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Batch ID</p>
                                    <p className="font-mono font-medium">{selectedOrder.batchId}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Workstation</p>
                                    <div className="flex items-center gap-2">
                                      <Wrench className="h-4 w-4 text-muted-foreground" />
                                      <p className="font-medium">{selectedOrder.workstation}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Assigned To</p>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-muted-foreground" />
                                      <p className="font-medium">{selectedOrder.assignedTo}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Production Progress</p>
                                    <p className="text-sm font-medium">
                                      {selectedOrder.completed}/{selectedOrder.quantity} units
                                    </p>
                                  </div>
                                  <Progress
                                    value={(selectedOrder.completed / selectedOrder.quantity) * 100}
                                    className="h-3"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                                    <p className="text-sm text-muted-foreground">Start Date</p>
                                    <p className="mt-1 font-medium">{selectedOrder.startDate}</p>
                                  </div>
                                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                                    <p className="text-sm text-muted-foreground">Due Date</p>
                                    <p className="mt-1 font-medium">{selectedOrder.dueDate}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className={statusConfig[selectedOrder.status].color}>
                                    {statusConfig[selectedOrder.status].label}
                                  </Badge>
                                  <Badge className={priorityConfig[selectedOrder.priority].color}>
                                    {priorityConfig[selectedOrder.priority].label} Priority
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
