// import { useState } from 'react'
// import { Plus } from 'lucide-react'
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
// import { incidents, batches, type Incident } from '@/lib/mock-data'

// const statusStyles: Record<string, string> = {
//   open: 'bg-red-500/20 text-red-400 border-red-500/30',
//   investigating: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
//   closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
// }

// const severityStyles: Record<string, string> = {
//   low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
//   medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
//   high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
//   critical: 'bg-red-500/20 text-red-400 border-red-500/30',
// }

// type FilterStatus = 'all' | 'open' | 'investigating' | 'resolved'

// export default function Incidents() {
//   const [filter, setFilter] = useState<FilterStatus>('all')
//   const [incidentList, setIncidentList] = useState<Incident[]>(incidents)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [newIncident, setNewIncident] = useState({
//     batchId: '',
//     title: '',
//     severity: 'medium' as Incident['severity'],
//     description: '',
//   })

//   const filteredIncidents = filter === 'all' ? incidentList : incidentList.filter((i) => i.status === filter)

//   const handleSubmit = () => {
//     if (!newIncident.batchId || !newIncident.title) return

//     const incident: Incident = {
//       id: `INC-2026-${String(incidentList.length + 4).padStart(3, '0')}`,
//       batchId: newIncident.batchId,
//       title: newIncident.title,
//       severity: newIncident.severity,
//       status: 'open',
//       reportedBy: 'Karim A.',
//       date: new Date().toISOString().split('T')[0],
//     }

//     setIncidentList((prev) => [incident, ...prev])
//     setIsModalOpen(false)
//     setNewIncident({ batchId: '', title: '', severity: 'medium', description: '' })
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <CardTitle>Incidents</CardTitle>
//             <div className="flex items-center gap-4">
//               <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
//                 <TabsList>
//                   <TabsTrigger value="all">All</TabsTrigger>
//                   <TabsTrigger value="open">Open</TabsTrigger>
//                   <TabsTrigger value="investigating">Investigating</TabsTrigger>
//                   <TabsTrigger value="resolved">Resolved</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//               <Button onClick={() => setIsModalOpen(true)}>
//                 <Plus className="mr-1 h-4 w-4" />
//                 Declare Incident
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border">
//                   <th className="pb-3 text-left font-medium text-muted-foreground">INC#</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Batch</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Title</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Severity</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Reported By</th>
//                   <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {filteredIncidents.map((incident) => (
//                   <tr key={incident.id}>
//                     <td className="py-3 font-mono text-xs">{incident.id}</td>
//                     <td className="py-3 font-mono text-xs text-muted-foreground">{incident.batchId}</td>
//                     <td className="max-w-[300px] truncate py-3" title={incident.title}>
//                       {incident.title}
//                     </td>
//                     <td className="py-3">
//                       <span
//                         className={cn(
//                           'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                           severityStyles[incident.severity]
//                         )}
//                       >
//                         {incident.severity}
//                       </span>
//                     </td>
//                     <td className="py-3">
//                       <span
//                         className={cn(
//                           'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
//                           statusStyles[incident.status]
//                         )}
//                       >
//                         {incident.status}
//                       </span>
//                     </td>
//                     <td className="py-3 text-muted-foreground">{incident.reportedBy}</td>
//                     <td className="py-3 text-muted-foreground">{incident.date}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {filteredIncidents.length === 0 && (
//               <div className="py-12 text-center text-muted-foreground">No incidents found</div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Declare Incident Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Declare Incident</DialogTitle>
//             <DialogDescription>
//               Report a new incident or anomaly in production
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="batch-select">Batch</Label>
//               <Select
//                 value={newIncident.batchId}
//                 onValueChange={(v) => setNewIncident((prev) => ({ ...prev, batchId: v }))}
//               >
//                 <SelectTrigger id="batch-select">
//                   <SelectValue placeholder="Select a batch" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {batches.map((batch) => (
//                     <SelectItem key={batch.id} value={batch.id}>
//                       {batch.id} — {batch.product}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 placeholder="Brief description of the incident"
//                 value={newIncident.title}
//                 onChange={(e) => setNewIncident((prev) => ({ ...prev, title: e.target.value }))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="severity">Severity</Label>
//               <Select
//                 value={newIncident.severity}
//                 onValueChange={(v) => setNewIncident((prev) => ({ ...prev, severity: v as Incident['severity'] }))}
//               >
//                 <SelectTrigger id="severity">
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
//                 placeholder="Detailed description of the incident..."
//                 rows={4}
//                 value={newIncident.description}
//                 onChange={(e) => setNewIncident((prev) => ({ ...prev, description: e.target.value }))}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={!newIncident.batchId || !newIncident.title}>
//               Submit Incident
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { incidentsApi, batchesApi, type Incident, type Batch } from '@/lib/api'

const statusStyles: Record<string, string> = {
  open:         'bg-red-500/20 text-red-400 border-red-500/30',
  investigating:'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resolved:     'bg-green-500/20 text-green-400 border-green-500/30',
  closed:       'bg-gray-500/20 text-gray-400 border-gray-500/30',
}
const severityStyles: Record<string, string> = {
  low:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium:   'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

type FilterStatus = 'all' | 'open' | 'investigating' | 'resolved'

export default function Incidents() {
  const [filter, setFilter]       = useState<FilterStatus>('all')
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [batches, setBatches]     = useState<Batch[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [form, setForm] = useState({ batchId: '', title: '', severity: 'medium', description: '' })

  useEffect(() => {
    async function load() {
      try {
        const [inc, bat] = await Promise.all([incidentsApi.getAll(), batchesApi.getAll()])
        setIncidents(inc)
        setBatches(bat)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit() {
    if (!form.batchId || !form.title) return
    try {
      setSubmitting(true)
      const created = await incidentsApi.create({
        batch_id:    Number(form.batchId),
        title:       form.title,
        description: form.description,
        severity:    form.severity,
      })
      setIncidents(prev => [created, ...prev])
      setIsModalOpen(false)
      setForm({ batchId: '', title: '', severity: 'medium', description: '' })
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.status === filter)

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
            <CardTitle>Incidents</CardTitle>
            <div className="flex items-center gap-4">
              <Tabs value={filter} onValueChange={v => setFilter(v as FilterStatus)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="investigating">Investigating</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-1 h-4 w-4" /> Declare Incident
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Batch</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Severity</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Reported by</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(inc => (
                  <tr key={inc.incident_id}>
                    <td className="py-3 font-mono text-xs">{inc.incident_id}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{inc.batch_id}</td>
                    <td className="max-w-[300px] truncate py-3" title={inc.title}>{inc.title}</td>
                    <td className="py-3">
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', severityStyles[inc.severity])}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', statusStyles[inc.status])}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {inc.reporter ? `${inc.reporter.first_name} ${inc.reporter.last_name}` : `User ${inc.reported_by}`}
                    </td>
                    <td className="py-3 text-muted-foreground">{inc.detected_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No incidents found</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Declare Incident</DialogTitle>
            <DialogDescription>Report a new incident or anomaly in production</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Batch</Label>
              <Select value={form.batchId} onValueChange={v => setForm(p => ({ ...p, batchId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select a batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map(b => (
                    <SelectItem key={b.batch_id} value={String(b.batch_id)}>
                      {b.batch_number} — {b.production_order?.product?.name ?? `Order ${b.production_order_id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Brief description of the incident"
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
            <Button onClick={handleSubmit} disabled={!form.batchId || !form.title || submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}