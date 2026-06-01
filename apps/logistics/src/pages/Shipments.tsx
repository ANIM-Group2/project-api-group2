import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { shipmentsApi, createShipmentApi, ordersApi, type Shipment, type CustomerOrder } from '@/lib/api'
import { cn } from '@/lib/utils'

function getStatusColor(status: string) {
  if (status === 'planned')   return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  if (status === 'ready')     return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  if (status === 'shipped')   return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  if (status === 'delivered') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  if (status === 'returned')  return 'bg-red-500/10 text-red-500 border-red-500/20'
  return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

export default function Shipments() {
  const [shipments,    setShipments]    = useState<Shipment[]>([])
  const [orders,       setOrders]       = useState<CustomerOrder[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  // Modal state
  const [isOpen,     setIsOpen]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError,  setFormError]  = useState<string | null>(null)
  const [form, setForm] = useState({
    customer_order_id: '',
    shipment_type:     'air',
    tracking_number:   '',
    shipment_date:     new Date().toISOString().split('T')[0],
  })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [raw, ord] = await Promise.all([
        shipmentsApi.getAll(),
        ordersApi.getAll(),
      ])
      const arr: Shipment[] = Array.isArray(raw) ? raw : (raw as any).data ?? []
      setShipments(arr)
      setOrders(ord)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load shipments')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    setFormError(null)
    if (!form.customer_order_id) { setFormError('Please select a customer order'); return }
    if (!form.shipment_date)     { setFormError('Please select a shipment date'); return }
    try {
      setSubmitting(true)
      await createShipmentApi.create({
        customer_order_id: Number(form.customer_order_id),
        shipment_type:     form.shipment_type,
        tracking_number:   form.tracking_number || undefined,
        shipment_date:     form.shipment_date,
      })
      await load()
      setIsOpen(false)
      setForm({ customer_order_id: '', shipment_type: 'air', tracking_number: '', shipment_date: new Date().toISOString().split('T')[0] })
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Failed to create shipment')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = statusFilter === 'all'
    ? shipments
    : shipments.filter(s => s.status === statusFilter)

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Shipments</h2>
          <p className="text-sm text-muted-foreground">{shipments.length} total shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Shipment
          </Button>
        </div>
      </div>

      {/* Shipment cards */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No shipments found</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((s, i) => (
            <Card key={s.shipment_id ?? i}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-medium">#{s.shipment_id}</span>
                      <Badge variant="outline" className={cn(getStatusColor(s.status), 'capitalize')}>
                        {s.status.replace('_', ' ')}
                      </Badge>
                      {(s as any).shipment_type && (
                        <Badge variant="secondary" className="capitalize">{(s as any).shipment_type}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer Order: #{s.customer_order_id}
                      {(s as any).order?.customer?.company_name && ` — ${(s as any).order.customer.company_name}`}
                    </p>
                    {s.tracking_number && (
                      <p className="text-xs font-mono text-muted-foreground">Track: {s.tracking_number}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-1 lg:items-end lg:text-right">
                    {(s as any).shipment_date && (
                      <p className="text-sm font-medium">
                        Date: {(s as any).shipment_date}
                        {s.status === 'delayed' && <span className="ml-1 text-red-500">(Overdue)</span>}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Shipment Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Shipment</DialogTitle>
            <DialogDescription>Create a new shipment for a customer order.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>
            )}

            <div className="grid gap-2">
              <Label>Customer Order</Label>
              <Select value={form.customer_order_id}
                onValueChange={v => setForm(p => ({ ...p, customer_order_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select an order" /></SelectTrigger>
                <SelectContent>
                  {orders.map(o => (
                    <SelectItem key={o.customer_order_id} value={String(o.customer_order_id)}>
                      #{o.customer_order_id} — {o.customer?.company_name ?? 'Customer'} ({o.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Shipment Type</Label>
              <Select value={form.shipment_type}
                onValueChange={v => setForm(p => ({ ...p, shipment_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="ground">Ground</SelectItem>
                  <SelectItem value="sea">Sea</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Tracking Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input placeholder="e.g. DHL-2026-042"
                value={form.tracking_number}
                onChange={e => setForm(p => ({ ...p, tracking_number: e.target.value }))} />
            </div>

            <div className="grid gap-2">
              <Label>Shipment Date</Label>
              <Input type="date" value={form.shipment_date}
                onChange={e => setForm(p => ({ ...p, shipment_date: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsOpen(false); setFormError(null) }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}