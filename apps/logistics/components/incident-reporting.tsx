'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { incidents, type Incident } from '@/lib/mock-data'
import {
  Search,
  Plus,
  AlertTriangle,
  Shield,
  Wrench,
  Leaf,
  Settings,
  Clock,
  CheckCircle2,
  Eye,
  Users,
  Calendar,
  MapPin,
  FileText,
  Layers,
} from 'lucide-react'

const typeConfig = {
  safety: { label: 'Safety', color: 'bg-destructive/20 text-destructive', icon: Shield },
  quality: { label: 'Quality', color: 'bg-chart-3/20 text-chart-3', icon: CheckCircle2 },
  equipment: { label: 'Equipment', color: 'bg-chart-1/20 text-chart-1', icon: Wrench },
  environmental: { label: 'Environmental', color: 'bg-chart-2/20 text-chart-2', icon: Leaf },
  process: { label: 'Process', color: 'bg-chart-4/20 text-chart-4', icon: Settings },
}

const severityConfig = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-chart-3/20 text-chart-3' },
  high: { label: 'High', color: 'bg-chart-4/20 text-chart-4' },
  critical: { label: 'Critical', color: 'bg-destructive/20 text-destructive' },
}

const statusConfig = {
  open: { label: 'Open', color: 'bg-destructive/20 text-destructive', icon: AlertTriangle },
  investigating: { label: 'Investigating', color: 'bg-chart-1/20 text-chart-1', icon: Eye },
  resolved: { label: 'Resolved', color: 'bg-accent/20 text-accent', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground', icon: CheckCircle2 },
}

export function IncidentReporting() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false)

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || incident.type === typeFilter
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
    return matchesSearch && matchesType && matchesSeverity && matchesStatus
  })

  const stats = {
    total: incidents.length,
    open: incidents.filter((i) => i.status === 'open').length,
    investigating: incidents.filter((i) => i.status === 'investigating').length,
    resolved: incidents.filter((i) => i.status === 'resolved' || i.status === 'closed').length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investigating</p>
                <p className="text-2xl font-bold">{stats.investigating}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
                <Eye className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{stats.critical}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {stats.critical > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base text-destructive">Critical Incidents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidents
                .filter((i) => i.severity === 'critical')
                .map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between rounded-lg border border-destructive/20 bg-background p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">
                          {incident.incidentNumber}
                        </span>
                        <Badge className={typeConfig[incident.type].color} variant="secondary">
                          {typeConfig[incident.type].label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium">{incident.title}</p>
                      <p className="text-xs text-muted-foreground">{incident.location}</p>
                    </div>
                    <Badge className={statusConfig[incident.status].color} variant="secondary">
                      {statusConfig[incident.status].label}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incidents List */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Incident Reports</CardTitle>
              <CardDescription>Track and manage safety, quality, and equipment incidents</CardDescription>
            </div>
            <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Report Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Report New Incident</DialogTitle>
                  <DialogDescription>
                    Document safety, quality, or equipment incidents
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Incident Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="quality">Quality</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="process">Process</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Severity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Brief description of the incident" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="Where did this occur?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Provide detailed information about the incident" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Affected Batches (optional)</Label>
                    <Input placeholder="Enter batch numbers separated by commas" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewIncidentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewIncidentOpen(false)}>Submit Report</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="process">Process</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Incident Cards */}
          <div className="space-y-4">
            {filteredIncidents.map((incident) => {
              const TypeIcon = typeConfig[incident.type].icon
              const StatusIcon = statusConfig[incident.status].icon

              return (
                <Dialog key={incident.id}>
                  <DialogTrigger asChild>
                    <div
                      className="cursor-pointer rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${typeConfig[incident.type].color}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm font-medium">
                                {incident.incidentNumber}
                              </span>
                              <Badge className={severityConfig[incident.severity].color} variant="secondary">
                                {severityConfig[incident.severity].label}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm font-medium">{incident.title}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {incident.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {incident.reportedDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {incident.reportedBy}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={statusConfig[incident.status].color} variant="secondary">
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[incident.status].label}
                        </Badge>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Incident Details</DialogTitle>
                      <DialogDescription>
                        {incident.incidentNumber} - {incident.title}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Type</p>
                          <Badge className={`mt-1 ${typeConfig[incident.type].color}`}>
                            {typeConfig[incident.type].label}
                          </Badge>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Severity</p>
                          <Badge className={`mt-1 ${severityConfig[incident.severity].color}`}>
                            {severityConfig[incident.severity].label}
                          </Badge>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge className={`mt-1 ${statusConfig[incident.status].color}`}>
                            {statusConfig[incident.status].label}
                          </Badge>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="mt-1 text-sm font-medium">{incident.location}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Description</h4>
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Reported By</p>
                          <p className="text-sm font-medium">{incident.reportedBy}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Report Date</p>
                          <p className="text-sm font-medium">{incident.reportedDate}</p>
                        </div>
                        {incident.assignedTo && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Assigned To</p>
                            <p className="text-sm font-medium">{incident.assignedTo}</p>
                          </div>
                        )}
                        {incident.resolvedDate && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Resolved Date</p>
                            <p className="text-sm font-medium">{incident.resolvedDate}</p>
                          </div>
                        )}
                      </div>

                      {incident.resolution && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Resolution</h4>
                          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                            <p className="text-sm">{incident.resolution}</p>
                          </div>
                        </div>
                      )}

                      {incident.affectedBatches && incident.affectedBatches.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-medium">
                            <Layers className="h-4 w-4" />
                            Affected Batches
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {incident.affectedBatches.map((batch) => (
                              <Badge key={batch} variant="outline" className="font-mono">
                                {batch}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
