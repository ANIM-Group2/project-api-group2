// KPIs
export const kpis = {
  revenueYTD: 6257000,
  activeOrders: 8,
  otd: 88.5,
  yield: 91.7,
  criticalIncidents: 2,
  capacity: 82.4,
  mtbf: 1840,
  mttr: 5.5,
  defectRate: 2.1,
}

// Monthly Data
export const monthlyData = [
  { month: 'Oct', revenue: 1340000, yield: 94.1, otd: 96.2, incidents: 0, margin: 39.5, target: 1300000 },
  { month: 'Nov', revenue: 1290000, yield: 91.7, otd: 93.5, incidents: 1, margin: 37.9, target: 1300000 },
  { month: 'Dec', revenue: 1250000, yield: 92.5, otd: 94.1, incidents: 1, margin: 38.2, target: 1300000 },
  { month: 'Jan', revenue: 1180000, yield: 88.3, otd: 90.0, incidents: 2, margin: 36.8, target: 1300000 },
  { month: 'Feb', revenue: 1167000, yield: 91.7, otd: 88.5, incidents: 2, margin: 37.1, target: 1300000 },
]

// Production Orders
export type ProductionOrder = {
  id: string
  product: string
  partNumber: string
  site: 'Lyon' | 'Toulouse'
  operator: string
  quantity: number
  completed: number
  status: 'pending' | 'in_progress' | 'quality_check' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate: string
}

export const productionOrders: ProductionOrder[] = [
  { id: 'OF-2026-0045', product: 'AX hydraulic valve', partNumber: 'PROD-AX-2401', site: 'Lyon', operator: 'John Smith', quantity: 50, completed: 32, status: 'in_progress', priority: 'high', dueDate: '2026-02-20' },
  { id: 'OF-2026-0046', product: 'High-pressure fitting', partNumber: 'PROD-AX-2402', site: 'Lyon', operator: 'Marie Blanc', quantity: 150, completed: 150, status: 'quality_check', priority: 'high', dueDate: '2026-02-17' },
  { id: 'OF-2026-0047', product: 'Reinforced drive shaft', partNumber: 'PROD-MT-1105', site: 'Toulouse', operator: 'Pierre Martin', quantity: 20, completed: 11, status: 'in_progress', priority: 'critical', dueDate: '2026-02-25' },
  { id: 'OF-2026-0048', product: 'Engine control module v2', partNumber: 'PROD-EL-3301', site: 'Lyon', operator: 'Sophie Leroy', quantity: 5, completed: 0, status: 'pending', priority: 'medium', dueDate: '2026-02-23' },
  { id: 'OF-2026-0049', product: 'CNC aluminum housing', partNumber: 'PROD-MT-1106', site: 'Toulouse', operator: 'Pierre Martin', quantity: 80, completed: 0, status: 'pending', priority: 'medium', dueDate: '2026-03-05' },
  { id: 'OF-2026-0050', product: 'Drone camera mount', partNumber: 'PROD-DR-5501', site: 'Lyon', operator: 'Luc Bernard', quantity: 80, completed: 55, status: 'in_progress', priority: 'high', dueDate: '2026-02-19' },
  { id: 'OF-2026-0054', product: 'AX hydraulic valve', partNumber: 'PROD-AX-2401', site: 'Lyon', operator: 'John Smith', quantity: 60, completed: 18, status: 'in_progress', priority: 'critical', dueDate: '2026-02-27' },
  { id: 'OF-2026-0055', product: 'Reinforced drive shaft', partNumber: 'PROD-MT-1105', site: 'Toulouse', operator: 'Pierre Martin', quantity: 25, completed: 8, status: 'in_progress', priority: 'critical', dueDate: '2026-03-02' },
  { id: 'OF-2026-0056', product: 'Engine control module v2', partNumber: 'PROD-EL-3301', site: 'Lyon', operator: 'Sophie Leroy', quantity: 15, completed: 6, status: 'in_progress', priority: 'high', dueDate: '2026-03-01' },
]

// Incidents
export type Incident = {
  id: string
  lotId: string
  type: 'quality' | 'safety' | 'equipment'
  description: string
  severity: 'low' | 'medium' | 'critical'
  status: 'open' | 'investigating' | 'resolved'
  site: 'Lyon' | 'Toulouse'
  operator: string
  date: string
  unitsAffected: number
}

export const incidents: Incident[] = [
  { id: 'INC-2026-001', lotId: 'LOT-AX-2401-001', type: 'quality', description: 'Dimension out of tolerance — Hydraulic valve', severity: 'medium', status: 'resolved', site: 'Lyon', operator: 'John Smith', date: '2026-02-02', unitsAffected: 12 },
  { id: 'INC-2026-002', lotId: 'LOT-MT-1105-001', type: 'quality', description: 'Surface roughness — Drive shaft', severity: 'low', status: 'investigating', site: 'Toulouse', operator: 'Pierre Martin', date: '2026-02-07', unitsAffected: 3 },
  { id: 'INC-2026-003', lotId: 'LOT-EL-3301-001', type: 'quality', description: 'Welding defect — Engine control module', severity: 'critical', status: 'investigating', site: 'Lyon', operator: 'Sophie Leroy', date: '2026-02-10', unitsAffected: 2 },
  { id: 'INC-2026-004', lotId: 'LOT-DR-5501-001', type: 'quality', description: 'Cosmetic scratch — Drone mount', severity: 'low', status: 'resolved', site: 'Lyon', operator: 'Luc Bernard', date: '2026-02-13', unitsAffected: 4 },
  { id: 'INC-2026-005', lotId: 'LOT-AX-2401-002', type: 'quality', description: 'Hydraulic leak test failure', severity: 'critical', status: 'open', site: 'Lyon', operator: 'John Smith', date: '2026-02-15', unitsAffected: 8 },
]

// Sites
export type Site = {
  name: 'Lyon' | 'Toulouse'
  activeOrders: number
  incidents: number
  operators: string[]
  capacity: number
  products: string[]
}

export const sites: Site[] = [
  { name: 'Lyon', activeOrders: 6, incidents: 3, operators: ['John Smith', 'Marie Blanc', 'Sophie Leroy', 'Luc Bernard'], capacity: 85, products: ['Hydraulic', 'Electronics', 'Drone'] },
  { name: 'Toulouse', activeOrders: 3, incidents: 1, operators: ['Pierre Martin'], capacity: 76, products: ['Mechanical'] },
]

// Top Customers
export const topCustomers = [
  { name: 'Airbus', revenue: 4500000 },
  { name: 'Boeing', revenue: 3200000 },
  { name: 'Lufthansa', revenue: 2850000 },
  { name: 'Safran', revenue: 2100000 },
  { name: 'Emirates', revenue: 1650000 },
]

// Yield by Category
export const yieldByCategory = [
  { category: 'Hydraulic', yield: 94.2 },
  { category: 'Mechanical', yield: 89.1 },
  { category: 'Electronics', yield: 87.3 },
  { category: 'Drone', yield: 96.8 },
  { category: 'Accessory', yield: 98.1 },
]

// Production Mix
export const productionMix = [
  { name: 'Hydraulic', value: 35 },
  { name: 'Mechanical', value: 28 },
  { name: 'Electronics', value: 18 },
  { name: 'Drone', value: 13 },
  { name: 'Accessory', value: 6 },
]

// Operators
export const operators = [
  { name: 'John Smith', site: 'Lyon', speciality: 'Hydraulic Systems', activeOrders: 2 },
  { name: 'Marie Blanc', site: 'Lyon', speciality: 'Hydraulic Assembly', activeOrders: 1 },
  { name: 'Sophie Leroy', site: 'Lyon', speciality: 'Electronics', activeOrders: 2 },
  { name: 'Luc Bernard', site: 'Lyon', speciality: 'Drone Assembly', activeOrders: 1 },
  { name: 'Pierre Martin', site: 'Toulouse', speciality: 'Mechanical Machining', activeOrders: 3 },
]
