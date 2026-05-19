// AERONEXIS Dynamics - Executive Dashboard Mock Data

export const kpis = {
  revenueYTD: 6257000,
  revenueTarget: 6500000,
  activeProductionOrders: 8,
  onTimeDelivery: 88.5,
  yieldRate: 91.7,
  criticalIncidentsOpen: 2,
  capacityUtilization: 82.4,
  lyonCapacity: 85,
  toulouseCapacity: 76,
  mtbf: 1840,
  mttr: 5.5,
  defectRate: 2.1,
}

export const monthlyPerformance = [
  { month: "Oct", revenue: 1340000, yield: 94.1, otd: 96.2, incidents: 0, margin: 39.5, target: 1300000 },
  { month: "Nov", revenue: 1290000, yield: 91.7, otd: 93.5, incidents: 1, margin: 37.9, target: 1300000 },
  { month: "Dec", revenue: 1250000, yield: 92.5, otd: 94.1, incidents: 1, margin: 38.2, target: 1300000 },
  { month: "Jan", revenue: 1180000, yield: 88.3, otd: 90.0, incidents: 2, margin: 36.8, target: 1300000 },
  { month: "Feb", revenue: 1167000, yield: 91.7, otd: 88.5, incidents: 2, margin: 37.1, target: 1300000 },
]

export type ProductionOrder = {
  id: string
  product: string
  partNumber: string
  site: "Lyon" | "Toulouse"
  operator: string
  quantity: number
  completed: number
  status: "in_progress" | "quality_check" | "pending" | "completed"
  priority: "critical" | "high" | "medium" | "low"
  startDate: string
  dueDate: string
}

export const productionOrders: ProductionOrder[] = [
  { id: "OF-2026-0045", product: "AX hydraulic valve", partNumber: "PROD-AX-2401", site: "Lyon", operator: "John Smith", quantity: 50, completed: 32, status: "in_progress", priority: "high", startDate: "2026-02-06", dueDate: "2026-02-20" },
  { id: "OF-2026-0046", product: "High-pressure fitting", partNumber: "PROD-AX-2402", site: "Lyon", operator: "Marie Blanc", quantity: 150, completed: 150, status: "quality_check", priority: "high", startDate: "2026-02-07", dueDate: "2026-02-17" },
  { id: "OF-2026-0047", product: "Reinforced drive shaft", partNumber: "PROD-MT-1105", site: "Toulouse", operator: "Pierre Martin", quantity: 20, completed: 11, status: "in_progress", priority: "critical", startDate: "2026-02-08", dueDate: "2026-02-25" },
  { id: "OF-2026-0048", product: "Engine control module v2", partNumber: "PROD-EL-3301", site: "Lyon", operator: "Sophie Leroy", quantity: 5, completed: 0, status: "pending", priority: "medium", startDate: "2026-02-10", dueDate: "2026-02-23" },
  { id: "OF-2026-0049", product: "CNC aluminum housing", partNumber: "PROD-MT-1106", site: "Toulouse", operator: "Pierre Martin", quantity: 80, completed: 0, status: "pending", priority: "medium", startDate: "2026-02-15", dueDate: "2026-03-05" },
  { id: "OF-2026-0050", product: "Drone camera mount", partNumber: "PROD-DR-5501", site: "Lyon", operator: "Luc Bernard", quantity: 80, completed: 55, status: "in_progress", priority: "high", startDate: "2026-02-06", dueDate: "2026-02-19" },
  { id: "OF-2026-0054", product: "AX hydraulic valve", partNumber: "PROD-AX-2401", site: "Lyon", operator: "John Smith", quantity: 60, completed: 18, status: "in_progress", priority: "critical", startDate: "2026-02-13", dueDate: "2026-02-27" },
  { id: "OF-2026-0055", product: "Reinforced drive shaft", partNumber: "PROD-MT-1105", site: "Toulouse", operator: "Pierre Martin", quantity: 25, completed: 8, status: "in_progress", priority: "critical", startDate: "2026-02-14", dueDate: "2026-03-02" },
  { id: "OF-2026-0056", product: "Engine control module v2", partNumber: "PROD-EL-3301", site: "Lyon", operator: "Sophie Leroy", quantity: 15, completed: 6, status: "in_progress", priority: "high", startDate: "2026-02-16", dueDate: "2026-03-01" },
]

export type Incident = {
  id: string
  batchId: string
  type: "quality" | "safety" | "equipment"
  title: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  site: "Lyon" | "Toulouse"
  reportedBy: string
  date: string
  impact: string
}

export const incidents: Incident[] = [
  { id: "INC-2026-001", batchId: "LOT-AX-2401-001", type: "quality", title: "Dimension out of tolerance — Hydraulic valve", severity: "medium", status: "resolved", site: "Lyon", reportedBy: "John Smith", date: "2026-02-02", impact: "12 units reworked" },
  { id: "INC-2026-002", batchId: "LOT-MT-1105-001", type: "quality", title: "Surface roughness non-conformance — Drive shaft", severity: "low", status: "investigating", site: "Toulouse", reportedBy: "Pierre Martin", date: "2026-02-07", impact: "3 units affected" },
  { id: "INC-2026-003", batchId: "LOT-EL-3301-001", type: "quality", title: "Welding defect micro-crack — Engine control module", severity: "critical", status: "investigating", site: "Lyon", reportedBy: "Sophie Leroy", date: "2026-02-10", impact: "2 units in quarantine — DO-178C review initiated" },
  { id: "INC-2026-004", batchId: "LOT-DR-5501-001", type: "quality", title: "Cosmetic scratch during packaging — Drone mount", severity: "low", status: "resolved", site: "Lyon", reportedBy: "Luc Bernard", date: "2026-02-13", impact: "4 units repainted" },
  { id: "INC-2026-005", batchId: "LOT-AX-2401-002", type: "quality", title: "Hydraulic leak test failure at 350 bar", severity: "critical", status: "open", site: "Lyon", reportedBy: "John Smith", date: "2026-02-15", impact: "8 units quarantined — suspected wrong O-ring grade" },
]

export type Site = {
  name: string
  activeOrders: number
  operators: Operator[]
  openIncidents: number
  capacity: number
  products: string[]
  status: "active" | "maintenance" | "offline"
}

export type Operator = {
  name: string
  site: "Lyon" | "Toulouse"
  activeOrders: number
  specialty: string
  initials: string
}

export const operators: Operator[] = [
  { name: "John Smith", site: "Lyon", activeOrders: 2, specialty: "Hydraulic specialist", initials: "JS" },
  { name: "Marie Blanc", site: "Lyon", activeOrders: 1, specialty: "Hydraulic specialist", initials: "MB" },
  { name: "Sophie Leroy", site: "Lyon", activeOrders: 2, specialty: "Electronics specialist", initials: "SL" },
  { name: "Luc Bernard", site: "Lyon", activeOrders: 1, specialty: "Drone specialist", initials: "LB" },
  { name: "Pierre Martin", site: "Toulouse", activeOrders: 3, specialty: "Mechanical specialist", initials: "PM" },
]

export const sites: Site[] = [
  {
    name: "Lyon",
    activeOrders: 6,
    operators: operators.filter(o => o.site === "Lyon"),
    openIncidents: 3,
    capacity: 85,
    products: ["Hydraulic", "Electronics", "Drone"],
    status: "active",
  },
  {
    name: "Toulouse",
    activeOrders: 3,
    operators: operators.filter(o => o.site === "Toulouse"),
    openIncidents: 1,
    capacity: 76,
    products: ["Mechanical"],
    status: "active",
  },
]

export const topCustomers = [
  { rank: 1, name: "Airbus Operations", flag: "🇫🇷", country: "France", type: "OEM", revenue: 4500000, orders: 42 },
  { rank: 2, name: "Boeing Supply Chain", flag: "🇺🇸", country: "USA", type: "OEM", revenue: 3200000, orders: 28 },
  { rank: 3, name: "Lufthansa Technik", flag: "🇩🇪", country: "Germany", type: "MRO", revenue: 2850000, orders: 35 },
  { rank: 4, name: "Safran Aircraft Engines", flag: "🇫🇷", country: "France", type: "Tier 1", revenue: 2100000, orders: 24 },
  { rank: 5, name: "Emirates Engineering", flag: "🇦🇪", country: "UAE", type: "MRO", revenue: 1650000, orders: 18 },
]

export const yieldByCategory = [
  { category: "Hydraulic", yield: 94.2, color: "hsl(var(--chart-1))" },
  { category: "Mechanical", yield: 89.1, color: "hsl(var(--chart-2))" },
  { category: "Electronics", yield: 87.3, color: "hsl(var(--chart-3))" },
  { category: "Drone", yield: 96.8, color: "hsl(var(--chart-4))" },
  { category: "Accessory", yield: 98.1, color: "hsl(var(--chart-5))" },
]

export const productionMix = [
  { name: "Hydraulic", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "Mechanical", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "Electronics", value: 18, fill: "hsl(var(--chart-3))" },
  { name: "Drone", value: 13, fill: "hsl(var(--chart-4))" },
  { name: "Accessory", value: 6, fill: "hsl(var(--chart-5))" },
]

export const incidentsByWeek = [
  { week: "Feb W1", count: 1 },
  { week: "Feb W2", count: 2 },
  { week: "Feb W3", count: 2 },
]

export const incidentsBySeverity = [
  { severity: "Critical", count: 2, fill: "hsl(0, 84%, 60%)" },
  { severity: "Medium", count: 1, fill: "hsl(45, 93%, 47%)" },
  { severity: "Low", count: 2, fill: "hsl(var(--muted-foreground))" },
]

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getProgressColor(progress: number): string {
  if (progress < 30) return "bg-red-500"
  if (progress < 60) return "bg-amber-500"
  return "bg-emerald-500"
}

export function getSeverityColor(severity: Incident["severity"]): string {
  switch (severity) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "low": return "bg-muted text-muted-foreground border-border"
  }
}

export function getStatusColor(status: Incident["status"]): string {
  switch (status) {
    case "open": return "bg-red-500/20 text-red-400 border-red-500/30"
    case "investigating": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "resolved": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    case "closed": return "bg-muted text-muted-foreground border-border"
  }
}

export function getOrderStatusColor(status: ProductionOrder["status"]): string {
  switch (status) {
    case "in_progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "quality_check": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "pending": return "bg-muted text-muted-foreground border-border"
    case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  }
}

export function getPriorityColor(priority: ProductionOrder["priority"]): string {
  switch (priority) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "low": return "bg-muted text-muted-foreground border-border"
  }
}
