import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Mail, Phone, ShoppingCart } from 'lucide-react';
import {
  customers,
  orders,
  formatCurrency,
  formatDate,
  type Customer,
} from '@/lib/sales-data';

const typeColors: Record<string, string> = {
  'Key Account': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Medium: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  SME: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function Customers() {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const getCustomerOrders = (customerId: string) => {
    return orders.filter((o) => o.customerId === customerId);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
            onClick={() => setSelectedCustomer(customer)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{customer.countryFlag}</span>
                  <div>
                    <CardTitle className="text-base">{customer.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{customer.country}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className={typeColors[customer.type]}>
                {customer.type}
              </Badge>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-lg font-semibold text-green-400">
                    {formatCurrency(customer.totalRevenue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-lg font-semibold">{customer.orderCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Detail Sheet */}
      <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <span className="text-2xl">{selectedCustomer?.countryFlag}</span>
              <span>{selectedCustomer?.name}</span>
            </SheetTitle>
          </SheetHeader>
          {selectedCustomer && (
            <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
              <div className="space-y-6 pr-4">
                {/* Type & Location */}
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={typeColors[selectedCustomer.type]}>
                    {selectedCustomer.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{selectedCustomer.country}</span>
                </div>

                {/* Contact Info */}
                {selectedCustomer.contact && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="font-medium">{selectedCustomer.contact.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{selectedCustomer.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedCustomer.contact.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Revenue Summary */}
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(selectedCustomer.totalRevenue)}
                    </p>
                  </CardContent>
                </Card>

                {/* Orders List */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <ShoppingCart className="h-4 w-4" />
                      Orders ({selectedCustomer.orderCount})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getCustomerOrders(selectedCustomer.id).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                        >
                          <div>
                            <p className="font-mono text-sm font-medium">{order.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(order.deliveryDate)} • {order.status}
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(order.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
