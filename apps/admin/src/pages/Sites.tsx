import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MapPin, Users, AlertTriangle, Factory, Loader2 } from 'lucide-react'
import { productionApi, type ProductionOrder, type Incident } from '@/lib/api'
import { cn } from '@/lib/utils'

interface SiteSummary {
  name: string
  activeOrders: number
  completedOrders: number
  incidents: number
  operators: Set<string>
}

export default function Sites() {
  const [orders,    setOrders]    = useState<ProductionOrder[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [o, i] = await Promise.all([productionApi.getOrders(), productionApi.getIncidents()])
        setOrders(o)
        setIncidents(i)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  // Build site summaries from real order data
  const siteMap: Record<string, SiteSummary> = {}
  for (const o of orders) {
    const siteName = o.site?.name ?? 'Unknown'
    if (!siteMap[siteName]) siteMap[siteName] = { name: siteName, activeOrders: 0, completedOrders: 0, incidents: 0, operators: new Set() }
    if (o.status === 'in_progress' || o.status === 'planned') siteMap[siteName].activeOrders++
    if (o.status === 'completed') siteMap[siteName].completedOrders++
    if (o.creator) siteMap[siteName].operators.add(`${o.creator.first_name} ${o.creator.last_name}`)
  }
  // Add incident counts (incidents don't have direct site — approximate from batch/order chain)
  for (const inc of incidents) {
    const siteName = inc.batch?.production_order?.site?.name ?? null
    if (siteName && siteMap[siteName]) siteMap[siteName].incidents++
  }

  const sites = Object.values(siteMap)
  const siteColors: Record<string, string> = {}
  const palette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
  sites.forEach((s, i) => { siteColors[s.name] = palette[i % palette.length] })

  const comparisonData = sites.map(s => ({
    site: s.name,
    'Active Orders': s.activeOrders,
    'Completed':     s.completedOrders,
    'Incidents':     s.incidents,
  }))

  // Operators with their orders
  const operatorMap: Record<string, { name: string; site: string; orders: number }> = {}
  for (const o of orders) {
    const name = o.creator ? `${o.creator.first_name} ${o.creator.last_name}` : null
    const site = o.site?.name ?? '—'
    if (!name) continue
    if (!operatorMap[name]) operatorMap[name] = { name, site, orders: 0 }
    if (o.status === 'in_progress') operatorMap[name].orders++
  }
  const operators = Object.values(operatorMap).sort((a, b) => b.orders - a.orders)

  return (
    <div className="space-y-6">
      {/* Site Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sites.map((site, idx) => {
          const color = palette[idx % palette.length]
          const totalOrders = site.activeOrders + site.completedOrders
          const capacity = totalOrders > 0 ? Math.round((site.activeOrders / Math.max(totalOrders, 1)) * 100) : 0
          return (
            <Card key={site.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                      <MapPin className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <CardTitle>{site.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Production Site</p>
                    </div>
                  </div>
                  <div className={cn('w-3 h-3 rounded-full', site.incidents > 0 ? 'bg-amber-500' : 'bg-green-500')} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Factory,       label: 'Active',     value: site.activeOrders },
                    { icon: AlertTriangle, label: 'Incidents',  value: site.incidents },
                    { icon: Users,         label: 'Operators',  value: site.operators.size },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="text-center p-3 bg-muted/50 rounded-lg">
                      <Icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active vs Total</span>
                    <span className="text-sm font-medium">{capacity}%</span>
                  </div>
                  <Progress value={capacity} className="h-2"
                    indicatorClassName={capacity > 70 ? 'bg-green-500' : capacity > 40 ? 'bg-amber-500' : 'bg-blue-500'} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Team</p>
                  <div className="flex flex-wrap gap-2">
                    {[...site.operators].map(op => (
                      <span key={op} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{op}</span>
                    ))}
                    {site.operators.size === 0 && <span className="text-xs text-muted-foreground">No operators assigned</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Site Comparison Chart */}
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Site Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="site" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="Active Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed"     fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Incidents"     fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operators Table */}
      <Card>
        <CardHeader><CardTitle>Operators by Active Orders</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Site</TableHead>
                <TableHead className="text-right">Active Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map(op => (
                <TableRow key={op.name}>
                  <TableCell className="font-medium">{op.name}</TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: `${siteColors[op.site]}20`, color: siteColors[op.site], borderColor: `${siteColors[op.site]}40` }}
                      variant="outline">{op.site}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{op.orders}</TableCell>
                </TableRow>
              ))}
              {operators.length === 0 && <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">No data</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}