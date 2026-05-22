import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ClipboardList, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react'
import { productionOrders, yieldByCategory } from '@/lib/admin-data'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/20 text-primary',
  quality_check: 'bg-warning/20 text-warning',
  completed: 'bg-success/20 text-success',
}

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/20 text-primary',
  high: 'bg-warning/20 text-warning',
  critical: 'bg-destructive/20 text-destructive',
}

const siteColors: Record<string, string> = {
  Lyon: 'bg-chart-1/20 text-chart-1',
  Toulouse: 'bg-chart-2/20 text-chart-2',
}

export default function Production() {
  const [siteFilter, setSiteFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = productionOrders.filter(order => {
    if (siteFilter !== 'all' && order.site !== siteFilter) return false
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    return true
  })

  const activeOrders = productionOrders.filter(o => o.status !== 'completed').length
  const completedOrders = productionOrders.filter(o => o.status === 'completed' || o.status === 'quality_check').length
  const avgProgress = Math.round(
    productionOrders.reduce((acc, o) => acc + (o.completed / o.quantity) * 100, 0) / productionOrders.length
  )
  const criticalPriority = productionOrders.filter(o => o.priority === 'critical').length

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-destructive'
    if (progress < 60) return 'bg-warning'
    return 'bg-success'
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold text-foreground">{activeOrders}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed / QC</p>
                <p className="text-2xl font-bold text-success">{completedOrders}</p>
              </div>
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Priority</p>
                <p className="text-2xl font-bold text-destructive">{criticalPriority}</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Site:</span>
          <div className="flex gap-1">
            <Button 
              variant={siteFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSiteFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={siteFilter === 'Lyon' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSiteFilter('Lyon')}
            >
              Lyon
            </Button>
            <Button 
              variant={siteFilter === 'Toulouse' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSiteFilter('Toulouse')}
            >
              Toulouse
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="quality_check">Quality Check</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Production Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Order #</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Part #</TableHead>
                <TableHead className="text-muted-foreground">Site</TableHead>
                <TableHead className="text-muted-foreground">Operator</TableHead>
                <TableHead className="text-muted-foreground">Qty</TableHead>
                <TableHead className="text-muted-foreground">Progress</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Priority</TableHead>
                <TableHead className="text-muted-foreground">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const progress = Math.round((order.completed / order.quantity) * 100)
                return (
                  <TableRow key={order.id} className="border-border">
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate">{order.product}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{order.partNumber}</TableCell>
                    <TableCell>
                      <Badge className={siteColors[order.site]}>{order.site}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{order.operator}</TableCell>
                    <TableCell className="text-sm">{order.completed}/{order.quantity}</TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={progress} 
                          className="h-2 flex-1"
                          indicatorClassName={getProgressColor(progress)}
                        />
                        <span className="text-xs text-muted-foreground w-9">{progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[order.priority]}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.dueDate}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Yield by Category */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Yield by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" domain={[80, 100]} stroke="#888" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="category" stroke="#888" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  formatter={(value: number) => [`${value}%`, 'Yield']}
                />
                <Bar dataKey="yield" radius={[0, 4, 4, 0]}>
                  {yieldByCategory.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.yield >= 95 ? '#10b981' : entry.yield >= 90 ? '#3b82f6' : '#f59e0b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
