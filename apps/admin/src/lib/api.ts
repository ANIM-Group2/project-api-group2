const GATEWAY = 'http://localhost:4000'

function getToken(): string {
  return localStorage.getItem('aeronexis_token') || ''
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${GATEWAY}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Types ─────────────────────────────────────────────────────

export interface ProductionOrder {
  production_order_id: number
  order_number: string
  status: string
  priority: string
  quantity_ordered: number
  planned_start: string | null
  planned_end: string | null
  creation_date: string
  product?: { name: string; reference: string }
  site?: { name: string }
  creator?: { first_name: string; last_name: string }
}

export interface Batch {
  batch_id: number
  batch_number: string
  status: string
  quantity_produced: number
  manufacturing_date: string
  production_order_id: number
  operator?: { first_name: string; last_name: string }
}

export interface Incident {
  incident_id: number
  batch_id: number
  title: string
  description: string | null
  severity: string
  status: string
  detected_at: string
  resolved_at: string | null
  reported_by: number
  reporter?: { first_name: string; last_name: string }
  batch?: { batch_number: string; production_order?: { order_number: string; site?: { name: string } } }
}

export interface ProductionKPIs {
  active_orders: number
  completed_orders: number
  critical_orders: number
  total_orders: number
  yield_rate: number | null
  completion_rate: number
}

export interface IncidentStats {
  open: number
  critical: number
  investigating: number
  resolved: number
}

export interface CustomerOrder {
  customer_order_id: number
  customer_id: number
  status: string
  total_amount: number
  is_urgent: boolean
  order_date: string
  customer?: { company_name: string; country: string }
}

export interface SalesStats {
  revenue_ytd: number
  revenue_mtd: number
  pending_orders: number
  active_orders: number
  urgent_orders: number
  orders_by_status: { status: string; count: number }[]
  top_customers: { company_name: string; order_count: number; revenue: number }[]
}

export interface RawMaterial {
  material_id: number
  reference: string
  name: string
  stock_quantity: number
  reserved_quantity: number
  safety_threshold: number
  unit: string
  supplier?: { company_name: string }
}

export interface SiteInfo {
  site_id: number
  name: string
  address: string
  country: string
}

// ── Production ────────────────────────────────────────────────

export interface CreateProductionOrderPayload {
  title: string
  priority: string
  site_id: number
  product_id: number
  quantity_ordered: number
  planned_start?: string
  planned_end?: string
}

export const productionApi = {
  getOrders: (params?: { status?: string; priority?: string }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<ProductionOrder[]>('GET', `/api/production/orders${q}`)
  },
  getKPIs: () => request<ProductionKPIs>('GET', '/api/production/orders/kpis'),
  createOrder: (data: CreateProductionOrderPayload) =>
    request<ProductionOrder>('POST', '/api/production/orders', data),
  getBatches: (params?: { status?: string }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<Batch[]>('GET', `/api/production/batches${q}`)
  },
  getIncidents: (params?: { status?: string; severity?: string }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<Incident[]>('GET', `/api/production/incidents${q}`)
  },
  getIncidentStats: () => request<IncidentStats>('GET', '/api/production/incidents/stats'),
}

// ── Orders / Sales ────────────────────────────────────────────

export const ordersApi = {
  getAll: (params?: { status?: string }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<CustomerOrder[]>('GET', `/api/orders/orders${q}`)
  },
  getStats: () => request<SalesStats>('GET', '/api/orders/stats'),
}

// ── Inventory ─────────────────────────────────────────────────

export const inventoryApi = {
  getStock: () => request<RawMaterial[]>('GET', '/api/inventory/stock'),
  getLowStock: () => request<RawMaterial[]>('GET', '/api/inventory/stock/low-stock'),
}

// ── Helpers ───────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}