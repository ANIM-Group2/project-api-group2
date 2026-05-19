"use client"

import * as React from "react"
import {
  Package,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  productionOrders,
  yieldByCategory,
  formatPercent,
  getProgressColor,
  getOrderStatusColor,
  getPriorityColor,
} from "@/lib/admin-data"

const statusLabels: Record<string, string> = {
  in_progress: "In Progress",
  quality_check: "Quality Check",
  pending: "Pending",
  completed: "Completed",
}

export function ProductionComponent() {
  const [siteFilter, setSiteFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredOrders = productionOrders.filter((order) => {
    const siteMatch = siteFilter === "all" || order.site.toLowerCase() === siteFilter
    const statusMatch = statusFilter === "all" || order.status === statusFilter
    return siteMatch && statusMatch
  })

  const activeOrders = productionOrders.filter((o) => o.status !== "completed").length
  const completedThisMonth = productionOrders.filter((o) => o.status === "completed" || o.completed === o.quantity).length
  const avgProgress = Math.round(
    productionOrders.reduce((acc, o) => acc + (o.completed / o.quantity) * 100, 0) / productionOrders.length
  )
  const criticalPriority = productionOrders.filter((o) => o.priority === "critical").length

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{completedThisMonth}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgProgress}%</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{criticalPriority}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-[180px] border-border bg-card">
            <SelectValue placeholder="Filter by site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            <SelectItem value="lyon">Lyon</SelectItem>
            <SelectItem value="toulouse">Toulouse</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-border bg-card">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="quality_check">Quality Check</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Production Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Production Orders</CardTitle>
          <CardDescription>All active and pending production orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Order #</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Part #</TableHead>
                <TableHead className="text-muted-foreground">Site</TableHead>
                <TableHead className="text-muted-foreground">Operator</TableHead>
                <TableHead className="text-muted-foreground">Qty</TableHead>
                <TableHead className="text-muted-foreground">Progress</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Priority</TableHead>
                <TableHead className="text-muted-foreground">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const progress = Math.round((order.completed / order.quantity) * 100)
                return (
                  <TableRow key={order.id} className="border-border">
                    <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                    <TableCell className="text-foreground">{order.product}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{order.partNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {order.site}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.operator}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.completed}/{order.quantity}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={progress} 
                          className="h-2 w-20 bg-muted" 
                        />
                        <span className={`text-xs font-medium ${
                          progress < 30 ? "text-red-400" : progress < 60 ? "text-amber-400" : "text-emerald-400"
                        }`}>
                          {progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getOrderStatusColor(order.status)}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.dueDate}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Yield by Category Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Yield by Product Category</CardTitle>
          <CardDescription>First-pass yield rate by product type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                domain={[80, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis 
                type="category" 
                dataKey="category" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`, "Yield"]}
              />
              <Bar 
                dataKey="yield" 
                fill="hsl(var(--chart-2))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
