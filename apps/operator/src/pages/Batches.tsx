// import { useState } from 'react'
// import { AlertTriangle } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '@/components/ui/dialog'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { cn } from '@/lib/utils'
// import { batches, incidents, type Batch, type Incident } from '@/lib/mock-data'

// const statusStyles: Record<string, string> = {
//   planned: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//   quality_check: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   completed: 'bg-green-500/20 text-green-400 border-green-500/30',
// }

// type FilterStatus = 'all' | 'planned' | 'in_progress' | 'quality_check' | 'completed'

// export default function Batches() {
//   const [filter, setFilter] = useState<FilterStatus>('all')
//   const [batchList, setBatchList] = useState<Batch[]>(batches)
//   const [incidentList, setIncidentList] = useState<Incident[]>(incidents)
//   const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false)
//   const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
//   const [anomalyForm, setAnomalyForm] = useState({
//     title: '',
//     severity: 'medium' as Incident['severity'],
//     description: '',
//   })

//   const filteredBatches = filter === 'all' ? batchList : batchList.filter((b) => b.status === filter)

//   const handleStart = (batchId: string) => {
//     setBatchList((prev) => prev.map((b) => (b.id === batchId ? { ...b, status: 'in_progress' as const } : b)))
//   }

//   const handleComplete = (batchId: string) => {
//     setBatchList((prev) => prev.map((b) => (b.id === batchId ? { ...b, status: 'completed' as const } : b)))
//   }

//   const handleReportAnomaly = (batch: Batch) => {
//     setSelectedBatch(batch)
//     setAnomalyForm({ title: '', severity: 'medium', description: '' })
//     setIsAnomalyModalOpen(true)
//   }

//   const handleSubmitAnomaly = () => {
//     if (!selectedBatch || !anomalyForm.title) return

//     const newIncident: Incident = {
//       id: `INC-2026-${String(incidentList.length + 4).padStart(3, '0')}`,
//       batchId: selectedBatch.id,
//       title: anomalyForm.title,
//       severity: anomalyForm.severity,
//       status: 'open',
//       reportedBy: 'Karim A.',
//       date: new Date().toISOString().split('T')[0],
//     }

//     setIncidentList((prev) => [newIncident, ...prev])
//     setIsAnomalyModalOpen(false)
//     setSelectedBatch(null)
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <CardTitle>Batches</CardTitle>
//             <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
//               <TabsList>
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="planned">Planned</TabsTrigger>
//                 <TabsTrigger value="in_progress">In Progress</TabsTrigger>
//                 <TabsTrigger value="quality_check">Quality Check</TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
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
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Production Order</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Qty</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Operator</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {filteredBatches.map((batch) => (
//                   <tr key={batch.id}>
//                     <td className="py-3 font-mono text-xs">{batch.id}</td>
//                     <td className="py-3 font-mono text-xs text-muted-foreground">{batch.orderId}</td>
//                     <td className="py-3">{batch.product}</td>
//                     <td className="py-3">{batch.quantity}</td>
//                     <td className="py-3 text-muted-foreground">{batch.operator}</td>
//                     <td className="py-3 text-muted-foreground">{batch.date}</td>
//                     <td className="py-3">
//                       <span
//                         className={cn(
//                           'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                           statusStyles[batch.status]
//                         )}
//                       >
//                         {batch.status.replace('_', ' ')}
//                       </span>
//                     </td>
//                     <td className="py-3">
//                       <div className="flex items-center gap-2">
//                         {batch.status === 'planned' && (
//                           <Button size="sm" onClick={() => handleStart(batch.id)}>
//                             Start
//                           </Button>
//                         )}
//                         {batch.status === 'in_progress' && (
//                           <>
//                             <Button size="sm" variant="secondary" onClick={() => handleComplete(batch.id)}>
//                               Complete
//                             </Button>
//                             <Button size="sm" variant="outline" onClick={() => handleReportAnomaly(batch)}>
//                               <AlertTriangle className="mr-1 h-3 w-3" />
//                               Report Anomaly
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {filteredBatches.length === 0 && (
//               <div className="py-12 text-center text-muted-foreground">No batches found</div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Anomaly Declaration Modal */}
//       <Dialog open={isAnomalyModalOpen} onOpenChange={setIsAnomalyModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Report Anomaly</DialogTitle>
//             <DialogDescription>
//               Report an anomaly or incident for batch {selectedBatch?.id}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="batch">Batch</Label>
//               <Input id="batch" value={selectedBatch?.id || ''} disabled />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 placeholder="Brief description of the anomaly"
//                 value={anomalyForm.title}
//                 onChange={(e) => setAnomalyForm((prev) => ({ ...prev, title: e.target.value }))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="severity">Severity</Label>
//               <Select
//                 value={anomalyForm.severity}
//                 onValueChange={(v) => setAnomalyForm((prev) => ({ ...prev, severity: v as Incident['severity'] }))}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                   <SelectItem value="critical">Critical</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Detailed description of the anomaly..."
//                 rows={4}
//                 value={anomalyForm.description}
//                 onChange={(e) => setAnomalyForm((prev) => ({ ...prev, description: e.target.value }))}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsAnomalyModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmitAnomaly} disabled={!anomalyForm.title}>
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
  const [filter, setFilter]     = useState<FilterStatus>('all')
  const [batches, setBatches]   = useState<Batch[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [selectedBatch, setSelectedBatch]   = useState<Batch | null>(null)
  const [submitting, setSubmitting]         = useState(false)
  const [form, setForm] = useState({ title: '', severity: 'medium', description: '' })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      setBatches(await batchesApi.getAll())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load batches')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(batchId: number, status: string) {
    try {
      setUpdating(batchId)
      const updated = await batchesApi.updateStatus(batchId, status)
      setBatches(prev => prev.map(b => b.batch_id === batchId ? { ...b, status: updated.status } : b))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setUpdating(null)
    }
  }

  async function handleSubmitIncident() {
    if (!selectedBatch || !form.title) return
    try {
      setSubmitting(true)
      await incidentsApi.create({
        batch_id:    selectedBatch.batch_id,
        title:       form.title,
        description: form.description,
        severity:    form.severity,
      })
      // if critical/high, batch is now quarantined — refresh
      await load()
      setIsModalOpen(false)
      setSelectedBatch(null)
      setForm({ title: '', severity: 'medium', description: '' })
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to submit incident')
    } finally {
      setSubmitting(false)
    }
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
                              onClick={() => handleUpdateStatus(batch.batch_id, 'completed')}>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Anomaly</DialogTitle>
            <DialogDescription>Report an anomaly for batch {selectedBatch?.batch_number}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Batch</Label>
              <Input value={selectedBatch?.batch_number ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
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
              <Label>Description</Label>
              <Textarea placeholder="Detailed description..." rows={4}
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitIncident} disabled={!form.title || submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}