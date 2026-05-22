import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ShoppingCart,
  Euro,
  AlertTriangle,
  Clock,
  Search,
  Eye,
  CheckCircle,
} from 'lucide-react';
import {
  orders,
  kpis,
  pendingApprovalIds,
  formatCurrency,
  formatDate,
  type Order,
} from '@/lib/sales-data';

const priorityColors: Record<string, string> = {
  Normal: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  High: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Urgent: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const statusColors: Record<string, string> = {
  'In Production': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Scheduled: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Completed: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function Orders() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [approvedOrders, setApprovedOrders] = useState<string[]>([]);

  const pendingOrders = orders.filter(
    (o) => pendingApprovalIds.includes(o.id) && !approvedOrders.includes(o.id)
  );

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'production' && order.status === 'In Production') ||
      (filter === 'scheduled' && order.status === 'Scheduled') ||
      (filter === 'completed' && order.status === 'Completed');
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (orderId: string) => {
    setApprovedOrders([...approvedOrders, orderId]);
  };

  const stats = [
    {
      title: 'Active Orders',
      value: kpis.activeOrders,
      icon: ShoppingCart,
      color: 'text-blue-400',
    },
    {
      title: 'Revenue',
      value: formatCurrency(kpis.revenueThisMonth),
      icon: Euro,
      color: 'text-green-400',
    },
    {
      title: 'Pending Approvals',
      value: pendingOrders.length,
      icon: AlertTriangle,
      color: 'text-red-400',
      highlight: true,
    },
    {
      title: 'On-Time Delivery',
      value: `${kpis.otd}%`,
      icon: Clock,
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={stat.highlight ? 'border-red-500/50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.highlight ? 'text-red-400' : ''}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approvals Banner */}
      {pendingOrders.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-300">Pending Approvals Required</h3>
                <div className="mt-2 space-y-2">
                  {pendingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background/50 p-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-foreground">{order.id}</span>
                        <span className="text-sm text-muted-foreground">
                          {order.countryFlag} {order.customerName}
                        </span>
                        <Badge variant="outline" className={priorityColors[order.priority]}>
                          {order.priority}
                        </Badge>
                        <span className="text-sm font-medium">{formatCurrency(order.amount)}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(order.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="w-64 pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Tabs value={filter} onValueChange={setFilter} className="mt-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="production">In Production</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-mono font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{order.countryFlag}</span>
                        <span>{order.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityColors[order.priority]}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.manager}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="font-mono">{selectedOrder?.id}</span>
              {selectedOrder && (
                <Badge variant="outline" className={statusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          {selectedOrder && (
            <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
              <div className="space-y-6 pr-4">
                {/* Customer Info */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Customer</h3>
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <span>{selectedOrder.countryFlag}</span>
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedOrder.country}</p>
                </div>

                {/* Order Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Delivery Date</h3>
                    <p className="text-lg font-medium">{formatDate(selectedOrder.deliveryDate)}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Amount</h3>
                    <p className="text-lg font-medium text-green-400">
                      {formatCurrency(selectedOrder.amount)}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Priority</h3>
                    <Badge variant="outline" className={priorityColors[selectedOrder.priority]}>
                      {selectedOrder.priority}
                    </Badge>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Manager</h3>
                    <p className="text-lg font-medium">{selectedOrder.manager}</p>
                  </div>
                </div>

                {/* Order Lines */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Order Lines</h3>
                  {selectedOrder.orderLines ? (
                    <div className="space-y-3">
                      {selectedOrder.orderLines.map((line, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-background p-3"
                        >
                          <div>
                            <p className="font-medium">{line.product}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {line.quantity} @ {formatCurrency(line.unitPrice)}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatCurrency(line.quantity * line.unitPrice)}
                          </p>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold text-green-400">
                          {formatCurrency(selectedOrder.amount)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Order lines not available</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
