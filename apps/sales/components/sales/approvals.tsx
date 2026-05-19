"use client"

import { useState } from "react"
import { Check, X, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { pendingApprovals, formatCurrency, formatDate, getPriorityColor, type Approval } from "@/lib/sales-data"
import { cn } from "@/lib/utils"

export function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>(pendingApprovals)
  const [approvedList, setApprovedList] = useState<Approval[]>([])
  const [rejectedList, setRejectedList] = useState<Approval[]>([])
  const [notesModal, setNotesModal] = useState<{ open: boolean; orderId: string | null }>({
    open: false,
    orderId: null,
  })
  const [notes, setNotes] = useState("")

  const handleApprove = (orderId: string) => {
    const approval = approvals.find((a) => a.orderId === orderId)
    if (approval) {
      setApprovals((prev) => prev.filter((a) => a.orderId !== orderId))
      setApprovedList((prev) => [...prev, { ...approval, status: "Approved" }])
    }
  }

  const handleReject = (orderId: string) => {
    const approval = approvals.find((a) => a.orderId === orderId)
    if (approval) {
      setApprovals((prev) => prev.filter((a) => a.orderId !== orderId))
      setRejectedList((prev) => [...prev, { ...approval, status: "Rejected" }])
    }
  }

  const handleRequestInfo = (orderId: string) => {
    setNotesModal({ open: true, orderId })
    setNotes("")
  }

  const handleSendNotes = () => {
    // In a real app, this would send the notes to the system
    setNotesModal({ open: false, orderId: null })
    setNotes("")
  }

  const ApprovalCard = ({ approval, showActions = true }: { approval: Approval; showActions?: boolean }) => (
    <Card className="py-4">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-foreground">{approval.orderId}</span>
              <Badge
                variant="outline"
                className={cn("border", getPriorityColor(approval.priority))}
              >
                {approval.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xl">{approval.countryFlag}</span>
              <span>{approval.customer}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-foreground">{formatCurrency(approval.amount)}</div>
            <div className="text-sm text-muted-foreground">
              Delivery: {formatDate(approval.deliveryDate)}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sales Manager</span>
            <span className="font-medium">{approval.manager}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order Summary</span>
            <span className="font-medium">{approval.orderSummary}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleApprove(approval.orderId)}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleRequestInfo(approval.orderId)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Request Info
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleReject(approval.orderId)}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}

        {!showActions && approval.status && (
          <div className="pt-2">
            <Badge
              variant="outline"
              className={cn(
                "border",
                approval.status === "Approved"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              )}
            >
              {approval.status}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {approvals.length > 0 && (
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                {approvals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            {approvedList.length > 0 && (
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1.5 text-xs font-medium text-white">
                {approvedList.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            {rejectedList.length > 0 && (
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium">
                {rejectedList.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {approvals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {approvals.map((approval) => (
                <ApprovalCard key={approval.orderId} approval={approval} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">All caught up!</h3>
                <p className="text-muted-foreground">No pending approvals at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {approvedList.map((approval) => (
                <ApprovalCard key={approval.orderId} approval={approval} showActions={false} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No approved orders yet</h3>
                <p className="text-muted-foreground">Approved orders will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {rejectedList.map((approval) => (
                <ApprovalCard key={approval.orderId} approval={approval} showActions={false} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <X className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No rejected orders</h3>
                <p className="text-muted-foreground">Rejected orders will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Info Modal */}
      <Dialog open={notesModal.open} onOpenChange={(open) => setNotesModal({ open, orderId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
            <DialogDescription>
              Send a note to the sales manager requesting more details about order {notesModal.orderId}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter your notes or questions here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesModal({ open: false, orderId: null })}>
              Cancel
            </Button>
            <Button onClick={handleSendNotes}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
