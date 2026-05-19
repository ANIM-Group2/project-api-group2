"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  customers,
  orders,
  formatCurrency,
  formatDate,
  getCustomerTypeColor,
  getStatusColor,
  type Customer,
} from "@/lib/sales-data"
import { cn } from "@/lib/utils"

export function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const getCustomerOrders = (customerName: string) => {
    return orders.filter((order) => order.customer === customerName)
  }

  const getCustomerTotalRevenue = (customerName: string) => {
    return getCustomerOrders(customerName).reduce((sum, order) => sum + order.amount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Customer Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {customers.map((customer) => (
          <Card
            key={customer.id}
            className="cursor-pointer transition-colors hover:border-primary/50 py-4"
            onClick={() => setSelectedCustomer(customer)}
          >
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{customer.countryFlag}</span>
                  <div>
                    <h3 className="font-semibold text-foreground leading-tight">
                      {customer.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("border", getCustomerTypeColor(customer.type))}
                >
                  {customer.type}
                </Badge>
                <Badge variant="outline" className="border-green-500/30 bg-green-500/20 text-green-400">
                  {customer.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Revenue</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(customer.annualRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orders</span>
                  <span className="font-medium text-foreground">
                    {customer.orderCount} order{customer.orderCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Details Sheet */}
      <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCustomer && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-xl">{selectedCustomer.countryFlag}</span>
                  {selectedCustomer.name}
                </SheetTitle>
                <SheetDescription>Customer Details</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Company Information
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country</span>
                      <span className="font-medium">{selectedCustomer.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <Badge
                        variant="outline"
                        className={cn("border", getCustomerTypeColor(selectedCustomer.type))}
                      >
                        {selectedCustomer.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="border-green-500/30 bg-green-500/20 text-green-400">
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Revenue</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(selectedCustomer.annualRevenue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Orders */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Orders ({getCustomerOrders(selectedCustomer.name).length})
                  </h3>
                  {getCustomerOrders(selectedCustomer.name).length > 0 ? (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Delivery</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCustomerOrders(selectedCustomer.name).map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn("border", getStatusColor(order.status))}
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(order.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="rounded-lg border bg-muted/30 p-4 text-center text-muted-foreground">
                      No orders found
                    </div>
                  )}
                </div>

                {/* Total Revenue */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total Revenue (Orders)</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatCurrency(getCustomerTotalRevenue(selectedCustomer.name))}
                    </span>
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
