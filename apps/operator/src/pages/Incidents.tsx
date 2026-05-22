import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { incidents, batches, type Incident } from '@/lib/mock-data'

const statusStyles: Record<string, string> = {
  open: 'bg-red-500/20 text-red-400 border-red-500/30',
  investigating: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const severityStyles: Record<string, string> = {
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

type FilterStatus = 'all' | 'open' | 'investigating' | 'resolved'

export default function Incidents() {
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [incidentList, setIncidentList] = useState<Incident[]>(incidents)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newIncident, setNewIncident] = useState({
    batchId: '',
    title: '',
    severity: 'medium' as Incident['severity'],
    description: '',
  })

  const filteredIncidents = filter === 'all' ? incidentList : incidentList.filter((i) => i.status === filter)

  const handleSubmit = () => {
    if (!newIncident.batchId || !newIncident.title) return

    const incident: Incident = {
      id: `INC-2026-${String(incidentList.length + 4).padStart(3, '0')}`,
      batchId: newIncident.batchId,
      title: newIncident.title,
      severity: newIncident.severity,
      status: 'open',
      reportedBy: 'Karim A.',
      date: new Date().toISOString().split('T')[0],
    }

    setIncidentList((prev) => [incident, ...prev])
    setIsModalOpen(false)
    setNewIncident({ batchId: '', title: '', severity: 'medium', description: '' })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Incidents</CardTitle>
            <div className="flex items-center gap-4">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="investigating">Investigating</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Declare Incident
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">INC#</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Batch</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Severity</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Reported By</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td className="py-3 font-mono text-xs">{incident.id}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{incident.batchId}</td>
                    <td className="max-w-[300px] truncate py-3" title={incident.title}>
                      {incident.title}
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                          severityStyles[incident.severity]
                        )}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                          statusStyles[incident.status]
                        )}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{incident.reportedBy}</td>
                    <td className="py-3 text-muted-foreground">{incident.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredIncidents.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No incidents found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Declare Incident Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Declare Incident</DialogTitle>
            <DialogDescription>
              Report a new incident or anomaly in production
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-select">Batch</Label>
              <Select
                value={newIncident.batchId}
                onValueChange={(v) => setNewIncident((prev) => ({ ...prev, batchId: v }))}
              >
                <SelectTrigger id="batch-select">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.id} — {batch.product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the incident"
                value={newIncident.title}
                onChange={(e) => setNewIncident((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={newIncident.severity}
                onValueChange={(v) => setNewIncident((prev) => ({ ...prev, severity: v as Incident['severity'] }))}
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the incident..."
                rows={4}
                value={newIncident.description}
                onChange={(e) => setNewIncident((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!newIncident.batchId || !newIncident.title}>
              Submit Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
