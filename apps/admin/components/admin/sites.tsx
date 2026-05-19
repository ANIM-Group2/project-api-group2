"use client"

import {
  Package,
  AlertTriangle,
  Users,
  Gauge,
} from "lucide-react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { sites, operators } from "@/lib/admin-data"

const siteComparisonData = [
  {
    category: "Active Orders",
    Lyon: sites[0].activeOrders,
    Toulouse: sites[1].activeOrders,
  },
  {
    category: "Open Incidents",
    Lyon: sites[0].openIncidents,
    Toulouse: sites[1].openIncidents,
  },
  {
    category: "Capacity %",
    Lyon: sites[0].capacity,
    Toulouse: sites[1].capacity,
  },
  {
    category: "Operators",
    Lyon: sites[0].operators.length,
    Toulouse: sites[1].operators.length,
  },
]

export function SitesComponent() {
  return (
    <div className="space-y-6">
      {/* Site Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {sites.map((site) => (
          <Card key={site.name} className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-foreground">{site.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-400">Active</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{site.activeOrders}</div>
                  <div className="text-xs text-muted-foreground">Orders</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{site.openIncidents}</div>
                  <div className="text-xs text-muted-foreground">Incidents</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{site.operators.length}</div>
                  <div className="text-xs text-muted-foreground">Operators</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <Gauge className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{site.capacity}%</div>
                  <div className="text-xs text-muted-foreground">Capacity</div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Capacity Utilization</span>
                  <span className={site.capacity > 80 ? "text-amber-400" : "text-emerald-400"}>
                    {site.capacity}%
                  </span>
                </div>
                <Progress 
                  value={site.capacity} 
                  className="h-2 bg-muted"
                />
              </div>

              {/* Products */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Product Categories</span>
                <div className="flex flex-wrap gap-2">
                  {site.products.map((product) => (
                    <Badge 
                      key={product} 
                      variant="outline" 
                      className="bg-primary/10 text-primary border-primary/30"
                    >
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Operators */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Operators</span>
                <div className="flex flex-wrap gap-2">
                  {site.operators.map((operator) => (
                    <div 
                      key={operator.name} 
                      className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5"
                    >
                      <Avatar className="h-6 w-6 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                          {operator.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{operator.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Site Comparison Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Site Comparison</CardTitle>
          <CardDescription>Key metrics comparison between Lyon and Toulouse</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={siteComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="Lyon" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Toulouse" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Operators Detail Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Operator Details</CardTitle>
          <CardDescription>All operators across sites with specialties and workload</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Site</TableHead>
                <TableHead className="text-muted-foreground">Specialty</TableHead>
                <TableHead className="text-muted-foreground">Active Orders</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator.name} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {operator.initials}
                        </AvatarFallback>
                      </Avatar>
                      {operator.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      {operator.site}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{operator.specialty}</TableCell>
                  <TableCell className="text-foreground">{operator.activeOrders}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
