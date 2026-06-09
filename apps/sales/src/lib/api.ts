const GATEWAY = 'http://localhost:4000'

function getToken(): string {
  return localStorage.getItem('aeronexis_token') || ''
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('aeronexis_user') || '{}') } catch { return {} }
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

export interface CustomerOrder {
  customer_order_id: number
  customer_id: number
  status: string
  total_amount: number
  is_urgent: boolean
  order_date: string
  expected_delivery: string | null
  validated_by: number | null
  customer?: { company_name: string; country: string; email: string; phone: string; contact_name: string }
  items?: OrderLine[]
  shipments?: Shipment[]
}

export interface OrderLine {
  customer_order_id: number
  product_id: number
  quantity: number
  unit_price: number
  product?: { name: string; reference: string }
}

export interface Customer {
  customer_id: number
  company_name: string
  contact_name: string
  email: string
  phone: string
  country: string
  orders?: CustomerOrder[]
}

export interface Shipment {
  shipment_id: number
  customer_order_id: number
  status: string
  shipment_date: string | null
  tracking_number: string | null
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

// ── Orders ────────────────────────────────────────────────────

export const ordersApi = {
  getAll: (params?: { status?: string; urgent?: string }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<CustomerOrder[]>('GET', `/api/orders/orders${q}`)
  },
  getById: (id: number) =>
    request<CustomerOrder>('GET', `/api/orders/orders/${id}`),
  approve: (id: number) =>
    request<CustomerOrder>('PATCH', `/api/orders/orders/${id}/approve`, {}),
  updateStatus: (id: number, status: string) =>
    request<CustomerOrder>('PATCH', `/api/orders/orders/\${id}/status`, { status }),
  create: (data: { customer_id: number; expected_delivery?: string; total_amount?: number; is_urgent?: boolean }) =>
    request<CustomerOrder>('POST', '/api/orders/orders', data),
}

// ── Customers ─────────────────────────────────────────────────

export const customersApi = {
  getAll: () => request<Customer[]>('GET', '/api/orders/customers'),
}

// ── Stats ─────────────────────────────────────────────────────

export const statsApi = {
  get: () => request<SalesStats>('GET', '/api/orders/stats'),
}

// ── Helpers ───────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export { getUser }