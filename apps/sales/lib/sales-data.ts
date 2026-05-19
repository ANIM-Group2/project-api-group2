// Types
export interface Order {
  id: string
  customer: string
  country: string
  countryFlag: string
  deliveryDate: string
  amount: number
  priority: "Normal" | "High" | "Urgent"
  status: "In Production" | "Scheduled" | "Completed" | "Delayed"
  manager: string
  orderLines?: OrderLine[]
}

export interface OrderLine {
  quantity: number
  product: string
  unitPrice: number
  total: number
}

export interface Customer {
  id: string
  name: string
  country: string
  countryFlag: string
  type: "Key Account" | "Medium" | "SME"
  annualRevenue: number
  orderCount: number
  status: "Active" | "Inactive"
}

export interface SalesManager {
  name: string
  orderCount: number
  totalRevenue: number
  avgOrderValue: number
}

export interface Approval {
  orderId: string
  customer: string
  countryFlag: string
  priority: "Normal" | "High" | "Urgent"
  amount: number
  deliveryDate: string
  manager: string
  orderSummary: string
  status: "Pending" | "Approved" | "Rejected"
}

// Mock Data
export const orders: Order[] = [
  {
    id: "CMD-2026-001",
    customer: "Lufthansa Technik",
    country: "Germany",
    countryFlag: "🇩🇪",
    deliveryDate: "2026-03-20",
    amount: 125000,
    priority: "High",
    status: "In Production",
    manager: "Sophie Martin",
    orderLines: [
      { quantity: 50, product: "AX hydraulic valve", unitPrice: 1250, total: 62500 },
      { quantity: 150, product: "High-pressure fitting", unitPrice: 340, total: 51000 },
    ],
  },
  {
    id: "CMD-2026-002",
    customer: "Boeing Supply Chain",
    country: "USA",
    countryFlag: "🇺🇸",
    deliveryDate: "2026-03-05",
    amount: 89000,
    priority: "Urgent",
    status: "In Production",
    manager: "Marc Dubois",
    orderLines: [
      { quantity: 20, product: "Reinforced drive shaft", unitPrice: 2890, total: 57800 },
      { quantity: 5, product: "Engine control module", unitPrice: 4200, total: 21000 },
    ],
  },
  {
    id: "CMD-2026-003",
    customer: "Airbus Operations",
    country: "France",
    countryFlag: "🇫🇷",
    deliveryDate: "2026-04-15",
    amount: 245000,
    priority: "Normal",
    status: "Scheduled",
    manager: "Sophie Martin",
  },
  {
    id: "CMD-2026-004",
    customer: "Air France Industries",
    country: "France",
    countryFlag: "🇫🇷",
    deliveryDate: "2026-03-15",
    amount: 67000,
    priority: "High",
    status: "In Production",
    manager: "Julie Leroux",
  },
  {
    id: "CMD-2026-005",
    customer: "DroneTech Industries",
    country: "UK",
    countryFlag: "🇬🇧",
    deliveryDate: "2026-03-01",
    amount: 34500,
    priority: "Normal",
    status: "Completed",
    manager: "Marc Dubois",
  },
  {
    id: "CMD-2026-006",
    customer: "Emirates Engineering",
    country: "UAE",
    countryFlag: "🇦🇪",
    deliveryDate: "2026-03-27",
    amount: 156000,
    priority: "High",
    status: "In Production",
    manager: "Sophie Martin",
  },
  {
    id: "CMD-2026-007",
    customer: "Safran Aircraft Engines",
    country: "France",
    countryFlag: "🇫🇷",
    deliveryDate: "2026-03-10",
    amount: 98000,
    priority: "Urgent",
    status: "In Production",
    manager: "Julie Leroux",
    orderLines: [
      { quantity: 15, product: "Engine control module", unitPrice: 4200, total: 63000 },
      { quantity: 100, product: "High-pressure fitting", unitPrice: 340, total: 34000 },
    ],
  },
  {
    id: "CMD-2026-008",
    customer: "AeroSystems Canada",
    country: "Canada",
    countryFlag: "🇨🇦",
    deliveryDate: "2026-04-11",
    amount: 52000,
    priority: "Normal",
    status: "Scheduled",
    manager: "Marc Dubois",
  },
  {
    id: "CMD-2026-009",
    customer: "Nordic Aviation Parts",
    country: "Sweden",
    countryFlag: "🇸🇪",
    deliveryDate: "2026-03-25",
    amount: 71000,
    priority: "Normal",
    status: "In Production",
    manager: "Julie Leroux",
  },
  {
    id: "CMD-2026-010",
    customer: "Iberia Maintenance",
    country: "Spain",
    countryFlag: "🇪🇸",
    deliveryDate: "2026-04-09",
    amount: 89500,
    priority: "High",
    status: "Scheduled",
    manager: "Sophie Martin",
  },
  {
    id: "CMD-2026-011",
    customer: "Lufthansa Technik",
    country: "Germany",
    countryFlag: "🇩🇪",
    deliveryDate: "2026-03-30",
    amount: 142000,
    priority: "Urgent",
    status: "In Production",
    manager: "Sophie Martin",
  },
  {
    id: "CMD-2026-012",
    customer: "Boeing Supply Chain",
    country: "USA",
    countryFlag: "🇺🇸",
    deliveryDate: "2026-04-05",
    amount: 198000,
    priority: "Normal",
    status: "Scheduled",
    manager: "Marc Dubois",
  },
]

export const customers: Customer[] = [
  { id: "1", name: "Lufthansa Technik", country: "Germany", countryFlag: "🇩🇪", type: "Key Account", annualRevenue: 2850000, orderCount: 2, status: "Active" },
  { id: "2", name: "Air France Industries", country: "France", countryFlag: "🇫🇷", type: "Key Account", annualRevenue: 1950000, orderCount: 1, status: "Active" },
  { id: "3", name: "Boeing Supply Chain", country: "USA", countryFlag: "🇺🇸", type: "Key Account", annualRevenue: 3200000, orderCount: 2, status: "Active" },
  { id: "4", name: "Safran Aircraft Engines", country: "France", countryFlag: "🇫🇷", type: "Key Account", annualRevenue: 2100000, orderCount: 1, status: "Active" },
  { id: "5", name: "Airbus Operations", country: "France", countryFlag: "🇫🇷", type: "Key Account", annualRevenue: 4500000, orderCount: 1, status: "Active" },
  { id: "6", name: "DroneTech Industries", country: "UK", countryFlag: "🇬🇧", type: "SME", annualRevenue: 450000, orderCount: 1, status: "Active" },
  { id: "7", name: "AeroSystems Canada", country: "Canada", countryFlag: "🇨🇦", type: "Medium", annualRevenue: 780000, orderCount: 1, status: "Active" },
  { id: "8", name: "Nordic Aviation Parts", country: "Sweden", countryFlag: "🇸🇪", type: "Medium", annualRevenue: 650000, orderCount: 1, status: "Active" },
  { id: "9", name: "Iberia Maintenance", country: "Spain", countryFlag: "🇪🇸", type: "Medium", annualRevenue: 890000, orderCount: 1, status: "Active" },
  { id: "10", name: "Emirates Engineering", country: "UAE", countryFlag: "🇦🇪", type: "Key Account", annualRevenue: 1650000, orderCount: 1, status: "Active" },
]

export const salesManagers: SalesManager[] = [
  { name: "Sophie Martin", orderCount: 5, totalRevenue: 757500, avgOrderValue: 151500 },
  { name: "Marc Dubois", orderCount: 4, totalRevenue: 368500, avgOrderValue: 92125 },
  { name: "Julie Leroux", orderCount: 3, totalRevenue: 236000, avgOrderValue: 78667 },
]

export const pendingApprovals: Approval[] = [
  {
    orderId: "CMD-2026-002",
    customer: "Boeing Supply Chain",
    countryFlag: "🇺🇸",
    priority: "Urgent",
    amount: 89000,
    deliveryDate: "2026-03-05",
    manager: "Marc Dubois",
    orderSummary: "20x drive shaft + 5x engine module",
    status: "Pending",
  },
  {
    orderId: "CMD-2026-006",
    customer: "Emirates Engineering",
    countryFlag: "🇦🇪",
    priority: "High",
    amount: 156000,
    deliveryDate: "2026-03-27",
    manager: "Sophie Martin",
    orderSummary: "60x hydraulic valve + 25x drive shaft",
    status: "Pending",
  },
  {
    orderId: "CMD-2026-007",
    customer: "Safran Aircraft Engines",
    countryFlag: "🇫🇷",
    priority: "Urgent",
    amount: 98000,
    deliveryDate: "2026-03-10",
    manager: "Julie Leroux",
    orderSummary: "15x engine module + 100x fitting",
    status: "Pending",
  },
  {
    orderId: "CMD-2026-011",
    customer: "Lufthansa Technik",
    countryFlag: "🇩🇪",
    priority: "Urgent",
    amount: 142000,
    deliveryDate: "2026-03-30",
    manager: "Sophie Martin",
    orderSummary: "60x hydraulic valve + 25x drive shaft",
    status: "Pending",
  },
]

export const revenueData = [
  { month: "Oct", revenue: 1340000 },
  { month: "Nov", revenue: 1290000 },
  { month: "Dec", revenue: 1250000 },
  { month: "Jan", revenue: 1180000 },
  { month: "Feb", revenue: 1167000 },
]

export const categoryData = [
  { name: "Hydraulic", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "Mechanical", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "Electronics", value: 18, fill: "hsl(var(--chart-3))" },
  { name: "Drone", value: 13, fill: "hsl(var(--chart-4))" },
  { name: "Accessory", value: 6, fill: "hsl(var(--chart-5))" },
]

export const topCustomers = [
  { name: "Airbus Operations", revenue: 4500000, orders: 1, type: "Key Account" as const },
  { name: "Boeing Supply Chain", revenue: 3200000, orders: 2, type: "Key Account" as const },
  { name: "Safran Aircraft Engines", revenue: 2100000, orders: 1, type: "Key Account" as const },
  { name: "Lufthansa Technik", revenue: 2850000, orders: 2, type: "Key Account" as const },
]

// Helper functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "Urgent":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "High":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "In Production":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Scheduled":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    case "Completed":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "Delayed":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getCustomerTypeColor(type: string): string {
  switch (type) {
    case "Key Account":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Medium":
      return "bg-muted text-muted-foreground border-border"
    case "SME":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}
