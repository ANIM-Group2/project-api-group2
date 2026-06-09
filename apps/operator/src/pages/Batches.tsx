

// import { useEffect, useState } from 'react'
// import { AlertTriangle, Loader2 } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { cn } from '@/lib/utils'
// import { batchesApi, incidentsApi, type Batch } from '@/lib/api'

// const statusStyles: Record<string, string> = {
//   planned:     'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//   completed:   'bg-green-500/20 text-green-400 border-green-500/30',
//   quarantined: 'bg-red-500/20 text-red-400 border-red-500/30',
// }

// type FilterStatus = 'all' | 'planned' | 'in_progress' | 'completed' | 'quarantined'

// export default function Batches() {
//   const [filter, setFilter]     = useState<FilterStatus>('all')
//   const [batches, setBatches]   = useState<Batch[]>([])
//   const [loading, setLoading]   = useState(true)
//   const [error, setError]       = useState<string | null>(null)
//   const [updating, setUpdating] = useState<number | null>(null)

//   const [isModalOpen, setIsModalOpen]       = useState(false)
//   const [selectedBatch, setSelectedBatch]   = useState<Batch | null>(null)
//   const [submitting, setSubmitting]         = useState(false)
//   const [form, setForm] = useState({ title: '', severity: 'medium', description: '' })

//   useEffect(() => { load() }, [])

//   async function load() {
//     try {
//       setLoading(true)
//       setBatches(await batchesApi.getAll())
//     } catch (e: unknown) {
//       setError(e instanceof Error ? e.message : 'Failed to load batches')
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleUpdateStatus(batchId: number, status: string) {
//     try {
//       setUpdating(batchId)
//       const updated = await batchesApi.updateStatus(batchId, status)
//       setBatches(prev => prev.map(b => b.batch_id === batchId ? { ...b, status: updated.status } : b))
//     } catch (e: unknown) {
//       alert(e instanceof Error ? e.message : 'Update failed')
//     } finally {
//       setUpdating(null)
//     }
//   }

//   async function handleSubmitIncident() {
//     if (!selectedBatch || !form.title) return
//     try {
//       setSubmitting(true)
//       await incidentsApi.create({
//         batch_id:    selectedBatch.batch_id,
//         title:       form.title,
//         description: form.description,
//         severity:    form.severity,
//       })
//       // if critical/high, batch is now quarantined — refresh
//       await load()
//       setIsModalOpen(false)
//       setSelectedBatch(null)
//       setForm({ title: '', severity: 'medium', description: '' })
//     } catch (e: unknown) {
//       alert(e instanceof Error ? e.message : 'Failed to submit incident')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const filtered = filter === 'all' ? batches : batches.filter(b => b.status === filter)

//   if (loading) return (
//     <div className="flex items-center justify-center py-24">
//       <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//     </div>
//   )
//   if (error) return (
//     <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
//   )

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <CardTitle>Batches</CardTitle>
//             <Tabs value={filter} onValueChange={v => setFilter(v as FilterStatus)}>
//               <TabsList>
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="planned">Planned</TabsTrigger>
//                 <TabsTrigger value="in_progress">In Progress</TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
//                 <TabsTrigger value="quarantined">Quarantined</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border">
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Batch#</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Order#</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Qty produced</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Operator</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {filtered.map(batch => (
//                   <tr key={batch.batch_id}>
//                     <td className="py-3 font-mono text-xs">{batch.batch_number}</td>
//                     <td className="py-3 font-mono text-xs text-muted-foreground">{batch.production_order?.order_number ?? batch.production_order_id}</td>
//                     <td className="py-3">{batch.production_order?.product?.name ?? '—'}</td>
//                     <td className="py-3">{batch.quantity_produced}</td>
//                     <td className="py-3 text-muted-foreground">
//                       {batch.operator ? `${batch.operator.first_name} ${batch.operator.last_name}` : '—'}
//                     </td>
//                     <td className="py-3 text-muted-foreground">{batch.manufacturing_date?.split('T')[0]}</td>
//                     <td className="py-3">
//                       <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', statusStyles[batch.status] ?? '')}>
//                         {batch.status.replace('_', ' ')}
//                       </span>
//                     </td>
//                     <td className="py-3">
//                       <div className="flex items-center gap-2">
//                         {batch.status === 'planned' && (
//                           <Button size="sm" disabled={updating === batch.batch_id}
//                             onClick={() => handleUpdateStatus(batch.batch_id, 'in_progress')}>
//                             {updating === batch.batch_id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Start'}
//                           </Button>
//                         )}
//                         {batch.status === 'in_progress' && (
//                           <>
//                             <Button size="sm" variant="secondary" disabled={updating === batch.batch_id}
//                               onClick={() => handleUpdateStatus(batch.batch_id, 'completed')}>
//                               {updating === batch.batch_id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Complete'}
//                             </Button>
//                             <Button size="sm" variant="outline"
//                               onClick={() => { setSelectedBatch(batch); setIsModalOpen(true) }}>
//                               <AlertTriangle className="mr-1 h-3 w-3" /> Report Anomaly
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {filtered.length === 0 && (
//               <div className="py-12 text-center text-muted-foreground">No batches found</div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Report Anomaly</DialogTitle>
//             <DialogDescription>Report an anomaly for batch {selectedBatch?.batch_number}</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label>Batch</Label>
//               <Input value={selectedBatch?.batch_number ?? ''} disabled />
//             </div>
//             <div className="space-y-2">
//               <Label>Title</Label>
//               <Input placeholder="Brief description of the anomaly"
//                 value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
//             </div>
//             <div className="space-y-2">
//               <Label>Severity</Label>
//               <Select value={form.severity} onValueChange={v => setForm(p => ({ ...p, severity: v }))}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                   <SelectItem value="critical">Critical</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Description</Label>
//               <Textarea placeholder="Detailed description..." rows={4}
//                 value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
//             <Button onClick={handleSubmitIncident} disabled={!form.title || submitting}>
//               {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//               Submit Incident
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }





import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { batchesApi, incidentsApi, type Batch } from '@/lib/api'

const statusStyles: Record<string, string> = {
  planned:     'bg-gray-500/20 text-gray-400 border-gray-500/30',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed:   'bg-green-500/20 text-green-400 border-green-500/30',
  quarantined: 'bg-red-500/20 text-red-400 border-red-500/30',
}

type FilterStatus = 'all' | 'planned' | 'in_progress' | 'completed' | 'quarantined'

export default function Batches() {
  const [filter,       setFilter]       = useState<FilterStatus>('all')
  const [batches,      setBatches]      = useState<Batch[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [updating,     setUpdating]     = useState<number | null>(null)

  // Incident form
  const [isModalOpen,   setIsModalOpen]   = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [submitting,    setSubmitting]    = useState(false)
  const [formError,     setFormError]     = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', severity: 'medium', description: '' })

  // Complete confirmation
  const [completingId,   setCompletingId]   = useState<number | null>(null)
  const [completeNotes,  setCompleteNotes]  = useState('')
  const [completeError,  setCompleteError]  = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      setBatches(await batchesApi.getAll())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load batches')
    } finally { setLoading(false) }
  }

  async function handleUpdateStatus(batchId: number, status: string, notes?: string) {
    try {
      setUpdating(batchId)
      const updated = await batchesApi.updateStatus(batchId, status, notes)
      setBatches(prev => prev.map(b => b.batch_id === batchId ? { ...b, status: updated.status } : b))
      setCompletingId(null)
      setCompleteNotes('')
      setCompleteError(null)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Update failed')
    } finally { setUpdating(null) }
  }

  function handleCompleteClick(batchId: number) {
    setCompletingId(batchId)
    setCompleteNotes('')
    setCompleteError(null)
  }

  function handleConfirmComplete() {
    if (!completingId) return
    if (!completeNotes.trim()) {
      setCompleteError('Completion notes are required before marking as completed')
      return
    }
    if (completeNotes.trim().length < 10) {
      setCompleteError('Please provide at least 10 characters in the notes')
      return
    }
    handleUpdateStatus(completingId, 'completed', completeNotes)
  }

  async function handleSubmitIncident() {
    setFormError(null)
    if (!selectedBatch) return
    if (!form.title.trim()) {
      setFormError('Title is required')
      return
    }
    if (form.title.trim().length < 5) {
      setFormError('Title must be at least 5 characters')
      return
    }
    if (!form.description.trim()) {
      setFormError('Description is required — please describe the anomaly')
      return
    }
    if (form.description.trim().length < 10) {
      setFormError('Description must be at least 10 characters')
      return
    }
    try {
      setSubmitting(true)
      await incidentsApi.create({
        batch_id:    selectedBatch.batch_id,
        title:       form.title,
        description: form.description,
        severity:    form.severity,
      })
      await load()
      setIsModalOpen(false)
      setSelectedBatch(null)
      setForm({ title: '', severity: 'medium', description: '' })
      setFormError(null)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to submit incident')
    } finally { setSubmitting(false) }
  }

  const filtered = filter === 'all' ? batches : batches.filter(b => b.status === filter)

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
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Batches</CardTitle>
            <Tabs value={filter} onValueChange={v => setFilter(v as FilterStatus)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="planned">Planned</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="quarantined">Quarantined</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Batch#</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Order#</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Qty produced</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Operator</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(batch => (
                  <tr key={batch.batch_id}>
                    <td className="py-3 font-mono text-xs">{batch.batch_number}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{batch.production_order?.order_number ?? batch.production_order_id}</td>
                    <td className="py-3">{batch.production_order?.product?.name ?? '—'}</td>
                    <td className="py-3">{batch.quantity_produced}</td>
                    <td className="py-3 text-muted-foreground">
                      {batch.operator ? `${batch.operator.first_name} ${batch.operator.last_name}` : '—'}
                    </td>
                    <td className="py-3 text-muted-foreground">{batch.manufacturing_date?.split('T')[0]}</td>
                    <td className="py-3">
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', statusStyles[batch.status] ?? '')}>
                        {batch.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {batch.status === 'planned' && (
                          <Button size="sm" disabled={updating === batch.batch_id}
                            onClick={() => handleUpdateStatus(batch.batch_id, 'in_progress')}>
                            {updating === batch.batch_id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Start'}
                          </Button>
                        )}
                        {batch.status === 'in_progress' && (
                          <>
                            <Button size="sm" variant="secondary" disabled={updating === batch.batch_id}
                              onClick={() => handleCompleteClick(batch.batch_id)}>
                              {updating === batch.batch_id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Complete'}
                            </Button>
                            <Button size="sm" variant="outline"
                              onClick={() => { setSelectedBatch(batch); setIsModalOpen(true) }}>
                              <AlertTriangle className="mr-1 h-3 w-3" /> Report Anomaly
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No batches found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Complete Batch Confirmation */}
      <Dialog open={!!completingId} onOpenChange={(o) => { if (!o) { setCompletingId(null); setCompleteError(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Batch</DialogTitle>
            <DialogDescription>Add notes before marking this batch as completed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {completeError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{completeError}</div>
            )}
            <div className="space-y-2">
              <Label>Completion Notes <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Describe what was completed, any observations..."
                rows={3} value={completeNotes}
                onChange={e => setCompleteNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCompletingId(null); setCompleteError(null) }}>Cancel</Button>
            <Button onClick={handleConfirmComplete} disabled={updating === completingId}
              className="bg-green-600 hover:bg-green-700">
              {updating === completingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Anomaly */}
      <Dialog open={isModalOpen} onOpenChange={(o) => { setIsModalOpen(o); if (!o) setFormError(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Anomaly</DialogTitle>
            <DialogDescription>Report an anomaly for batch {selectedBatch?.batch_number}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>
            )}
            <div className="space-y-2">
              <Label>Batch</Label>
              <Input value={selectedBatch?.batch_number ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input placeholder="Brief description of the anomaly"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={form.severity} onValueChange={v => setForm(p => ({ ...p, severity: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Detailed description..." rows={4}
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setFormError(null) }}>Cancel</Button>
            <Button onClick={handleSubmitIncident} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}