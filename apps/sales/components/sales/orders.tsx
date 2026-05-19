"use client"

import { useState } from "react"
import {
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Clock,
  Check,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  orders,
  pendingApprovals,
  formatCurrency,
  formatDate,
  getPriorityColor,
  getStatusColor,
  type Order,
} from "@/lib/sales-data"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Active Orders",
    value: "9",
    icon: ShoppingCart,
    color: "text-blue-400",
  },
  {
    title: "Revenue This Month",
    value: "€1,167,000",
    icon: DollarSign,
    color: "text-green-400",
  },
  {
    title: "Pending Approvals",
    value: "4",
    icon: AlertTriangle,
    color: "text-red-400",
    highlight: true,
  },
  {
    title: "On-Time Delivery",
    value: "88.5%",
    icon: Clock,
    color: "text-amber-400",
  },
]

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [approvedOrders, setApprovedOrders] = useState<string[]>([])

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true
    if (statusFilter === "in-production") return order.status === "In Production"
    if (statusFilter === "scheduled") return order.status === "Scheduled"
    if (statusFilter === "completed") return order.status === "Completed"
    return true
  })

  const handleApprove = (orderId: string) => {
    setApprovedOrders((prev) => [...prev, orderId])
  }

  const pendingToShow = pendingApprovals.filter(
    (approval) => !approvedOrders.includes(approval.orderId)
  )

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={cn("py-4", stat.highlight && "border-red-500/50")}>
            <CardContent className="flex items-center gap-4">
              <div className={cn("rounded-lg bg-muted p-2.5", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className={cn("text-2xl font-bold", stat.highlight && "text-red-400")}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approvals Banner */}
      {pendingToShow.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {pendingToShow.map((approval) => (
                <div
                  key={approval.orderId}
                  className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-2"
                >
                  <span className="font-medium text-foreground">{approval.orderId}</span>
                  <Button
                    size="sm"
                    className="h-7 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(approval.orderId)}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Approve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-production">In Production</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <span className="mr-1">{order.countryFlag}</span>
                      </TableCell>
                      <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                      <TableCell>{formatCurrency(order.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("border", getPriorityColor(order.priority))}
                        >
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("border", getStatusColor(order.status))}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.manager}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrder(order)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Details Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedOrder.id}
                  <Badge
                    variant="outline"
                    className={cn("border", getStatusColor(selectedOrder.status))}
                  >
                    {selectedOrder.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>Order Details</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer Information
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedOrder.countryFlag}</span>
                      <span className="font-medium text-foreground">
                        {selectedOrder.customer}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOrder.country}
                    </div>
                  </div>
                </div>

                {/* Order Lines */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Order Lines
                  </h3>
                  {selectedOrder.orderLines ? (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Unit</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.orderLines.map((line, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{line.product}</TableCell>
                              <TableCell className="text-right">{line.quantity}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(line.unitPrice)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(line.total)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="rounded-lg border bg-muted/30 p-4 text-center text-muted-foreground">
                      Order lines not available
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Summary
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Date</span>
                      <span className="font-medium">{formatDate(selectedOrder.deliveryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority</span>
                      <Badge
                        variant="outline"
                        className={cn("border", getPriorityColor(selectedOrder.priority))}
                      >
                        {selectedOrder.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manager</span>
                      <span className="font-medium">{selectedOrder.manager}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(selectedOrder.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
