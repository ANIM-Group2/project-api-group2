import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, MessageSquare, Clock, User } from 'lucide-react';
import {
  orders,
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

interface ApprovalItem {
  order: Order;
  status: 'pending' | 'approved' | 'rejected';
  processedAt?: string;
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(() =>
    pendingApprovalIds.map((id) => ({
      order: orders.find((o) => o.id === id)!,
      status: 'pending',
    }))
  );
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [infoMessage, setInfoMessage] = useState('');

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const approvedApprovals = approvals.filter((a) => a.status === 'approved');
  const rejectedApprovals = approvals.filter((a) => a.status === 'rejected');

  const handleApprove = (orderId: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.order.id === orderId
          ? { ...a, status: 'approved', processedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const handleReject = (orderId: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.order.id === orderId
          ? { ...a, status: 'rejected', processedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const openInfoDialog = (order: Order) => {
    setSelectedOrder(order);
    setInfoMessage('');
    setInfoDialogOpen(true);
  };

  const sendInfoRequest = () => {
    setInfoDialogOpen(false);
    setInfoMessage('');
  };

  const ApprovalCard = ({
    item,
    showActions = true,
  }: {
    item: ApprovalItem;
    showActions?: boolean;
  }) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-mono text-lg">{item.order.id}</CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg">{item.order.countryFlag}</span>
              <span className="text-muted-foreground">{item.order.customerName}</span>
            </div>
          </div>
          <Badge variant="outline" className={priorityColors[item.order.priority]}>
            {item.order.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="text-xl font-bold text-green-400">
              {formatCurrency(item.order.amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Delivery</p>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{formatDate(item.order.deliveryDate)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{item.order.manager}</span>
        </div>

        {/* Order Lines Summary */}
        {item.order.orderLines && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Order Lines</p>
            <div className="space-y-1">
              {item.order.orderLines.map((line, idx) => (
                <p key={idx} className="text-sm">
                  {line.quantity}x {line.product}
                </p>
              ))}
            </div>
          </div>
        )}

        {item.processedAt && (
          <p className="text-xs text-muted-foreground">
            {item.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
            {formatDate(item.processedAt)}
          </p>
        )}

        {showActions && item.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleApprove(item.order.id)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => openInfoDialog(item.order)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleReject(item.order.id)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingApprovals.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                {pendingApprovals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-400" />
                <p className="mt-4 text-lg font-medium">All caught up!</p>
                <p className="text-muted-foreground">No pending approvals</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingApprovals.map((item) => (
                <ApprovalCard key={item.order.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No approved items yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {approvedApprovals.map((item) => (
                <ApprovalCard key={item.order.id} item={item} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No rejected items</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {rejectedApprovals.map((item) => (
                <ApprovalCard key={item.order.id} item={item} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Info Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium">{selectedOrder?.id}</p>
              <p className="text-sm text-muted-foreground">
                {selectedOrder?.countryFlag} {selectedOrder?.customerName}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message to Manager</Label>
              <Input
                id="message"
                placeholder="What information do you need?"
                value={infoMessage}
                onChange={(e) => setInfoMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInfoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendInfoRequest}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
