import { useEffect, useState } from 'react'
import { Search, Mail, Phone, ShoppingCart, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { customersApi, type Customer, formatCurrency, formatDate } from '@/lib/api'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft:         'bg-gray-500/20 text-gray-300',
  confirmed:     'bg-blue-500/20 text-blue-300',
  in_production: 'bg-purple-500/20 text-purple-300',
  shipped:       'bg-amber-500/20 text-amber-300',
  delivered:     'bg-green-500/20 text-green-300',
  cancelled:     'bg-red-500/20 text-red-300',
}

export default function Customers() {
  const [customers,  setCustomers]  = useState<Customer[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState<Customer | null>(null)

  useEffect(() => {
    customersApi.getAll()
      .then(setCustomers)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.country ?? '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (error)   return <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(c => {
          const totalRevenue = c.orders?.reduce((s, o) => s + Number(o.total_amount), 0) ?? 0
          const orderCount   = c.orders?.length ?? 0
          return (
            <Card key={c.customer_id} className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
              onClick={() => setSelected(c)}>
              <CardHeader className="pb-3">
                <div>
                  <CardTitle className="text-base">{c.company_name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{c.country ?? '—'}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.email && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-lg font-semibold text-green-400">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-lg font-semibold">{orderCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selected?.company_name}</SheetTitle>
          </SheetHeader>
          {selected && (
            <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
              <div className="space-y-4 pr-4">
                <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                  <p className="text-sm font-medium">Contact</p>
                  {selected.contact_name && <p className="text-sm">{selected.contact_name}</p>}
                  {selected.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />{selected.email}
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />{selected.phone}
                    </div>
                  )}
                </div>

                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(selected.orders?.reduce((s, o) => s + Number(o.total_amount), 0) ?? 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <ShoppingCart className="h-4 w-4" />
                      Orders ({selected.orders?.length ?? 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(selected.orders ?? []).map(o => (
                        <div key={o.customer_order_id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                          <div>
                            <p className="font-mono text-sm font-medium">#{o.customer_order_id}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(o.expected_delivery)} •{' '}
                              <span className={cn('capitalize', statusColors[o.status]?.split(' ')[1])}>{o.status.replace('_', ' ')}</span>
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(Number(o.total_amount))}</p>
                        </div>
                      ))}
                      {(!selected.orders || selected.orders.length === 0) && (
                        <p className="text-sm text-muted-foreground">No orders yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}