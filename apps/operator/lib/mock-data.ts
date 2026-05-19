// ============================================================
//  AERONEXIS DYNAMICS — Mock Data
//  Generated from EN_AERONEXIS_DYNAMICS_DATABASE.xlsx
//  Replace fetch calls with real API endpoints when backend is ready
// ============================================================

// ─── INTERFACES ─────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  country: string
  type: 'Key Account' | 'Medium' | 'SME'
  annualRevenue: number
  status: 'Active' | 'Inactive'
}

export interface Product {
  code: string
  description: string
  category: 'Hydraulic' | 'Mechanical' | 'Electronics' | 'Drone' | 'Accessory'
  unitPrice: number
  manufacturingTimeH: number
  weightKg: number
  certification: string
}

export interface ProductionOrder {
  id: string
  orderNumber: string
  product: string
  partNumber: string
  quantity: number
  completed: number
  status: 'pending' | 'in_progress' | 'quality_check' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: string
  dueDate: string
  workstation: string
  assignedTo: string
  batchId: string
  site: string
}

export interface InventoryItem {
  id: string
  partNumber: string
  name: string
  category: 'raw_material' | 'component' | 'assembly' | 'finished_good'
  quantity: number
  minStock: number
  maxStock: number
  reservedStock: number
  unit: string
  location: string
  lastUpdated: string
  supplier: string
  unitCost: number
  batchNumbers: string[]
}

export interface Batch {
  id: string
  batchNumber: string
  product: string
  partNumber: string
  quantity: number
  manufacturedDate: string
  expiryDate?: string
  status: 'active' | 'quarantine' | 'released' | 'recalled'
  qualityCerts: string[]
  traceability: {
    rawMaterials: string[]
    productionOrders: string[]
    shipments: string[]
  }
}

export interface Shipment {
  id: string
  shipmentNumber: string
  type: 'inbound' | 'outbound'
  status: 'scheduled' | 'in_transit' | 'delivered' | 'delayed'
  origin: string
  destination: string
  carrier: string
  estimatedArrival: string
  actualArrival?: string
  items: { partNumber: string; quantity: number; batchId: string }[]
  priority: 'standard' | 'express' | 'critical'
}

export interface Incident {
  id: string
  incidentNumber: string
  type: 'safety' | 'quality' | 'equipment' | 'environmental' | 'process'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  title: string
  description: string
  location: string
  reportedBy: string
  reportedDate: string
  assignedTo?: string
  resolution?: string
  resolvedDate?: string
  affectedBatches?: string[]
}

export interface KPIData {
  oee: number
  productionYield: number
  onTimeDelivery: number
  defectRate: number
  inventoryTurnover: number
  capacityUtilization: number
  mtbf: number
  mttr: number
}

export interface CustomerOrder {
  orderNumber: string
  customerId: string
  customerName: string
  orderDate: string
  expectedDelivery: string
  status: 'In production' | 'Scheduled' | 'Completed' | 'Delayed'
  totalAmount: number
  priority: 'Normal' | 'High' | 'Urgent'
  salesManager: string
}

// ─── CUSTOMERS ───────────────────────────────────────────────

export const customers: Customer[] = [
  { id: 'CLI001', name: 'Lufthansa Technik',      country: 'Germany', type: 'Key Account', annualRevenue: 2850000, status: 'Active' },
  { id: 'CLI002', name: 'Air France Industries',  country: 'France',  type: 'Key Account', annualRevenue: 1950000, status: 'Active' },
  { id: 'CLI003', name: 'Boeing Supply Chain',    country: 'USA',     type: 'Key Account', annualRevenue: 3200000, status: 'Active' },
  { id: 'CLI004', name: 'Safran Aircraft Engines', country: 'France', type: 'Key Account', annualRevenue: 2100000, status: 'Active' },
  { id: 'CLI005', name: 'Airbus Operations',      country: 'France',  type: 'Key Account', annualRevenue: 4500000, status: 'Active' },
  { id: 'CLI006', name: 'DroneTech Industries',   country: 'UK',      type: 'SME',         annualRevenue: 450000,  status: 'Active' },
  { id: 'CLI007', name: 'AeroSystems Canada',     country: 'Canada',  type: 'Medium',      annualRevenue: 780000,  status: 'Active' },
  { id: 'CLI008', name: 'Nordic Aviation Parts',  country: 'Sweden',  type: 'Medium',      annualRevenue: 650000,  status: 'Active' },
  { id: 'CLI009', name: 'Iberia Maintenance',     country: 'Spain',   type: 'Medium',      annualRevenue: 890000,  status: 'Active' },
  { id: 'CLI010', name: 'Emirates Engineering',   country: 'UAE',     type: 'Key Account', annualRevenue: 1650000, status: 'Active' },
]

// ─── PRODUCTS ────────────────────────────────────────────────

export const products: Product[] = [
  { code: 'PROD-AX-2401', description: 'AX series hydraulic valve',          category: 'Hydraulic',   unitPrice: 1250, manufacturingTimeH: 8,  weightKg: 2.3,  certification: 'EN9100'  },
  { code: 'PROD-AX-2402', description: '3/4" high-pressure fitting',         category: 'Hydraulic',   unitPrice: 340,  manufacturingTimeH: 3,  weightKg: 0.8,  certification: 'EN9100'  },
  { code: 'PROD-MT-1105', description: 'Reinforced drive shaft',             category: 'Mechanical',  unitPrice: 2890, manufacturingTimeH: 15, weightKg: 12.5, certification: 'AS9100'  },
  { code: 'PROD-MT-1106', description: 'CNC-machined aluminum housing',      category: 'Mechanical',  unitPrice: 1670, manufacturingTimeH: 12, weightKg: 5.2,  certification: 'AS9100'  },
  { code: 'PROD-EL-3301', description: 'Engine control module v2',           category: 'Electronics', unitPrice: 4200, manufacturingTimeH: 6,  weightKg: 1.1,  certification: 'DO-178C' },
  { code: 'PROD-EL-3302', description: 'Differential pressure sensor',       category: 'Electronics', unitPrice: 890,  manufacturingTimeH: 4,  weightKg: 0.3,  certification: 'DO-160'  },
  { code: 'PROD-DR-5501', description: 'Long-range drone camera mount',      category: 'Drone',       unitPrice: 560,  manufacturingTimeH: 5,  weightKg: 0.9,  certification: 'CE'      },
  { code: 'PROD-DR-5502', description: 'Battery mounting system',            category: 'Drone',       unitPrice: 420,  manufacturingTimeH: 4,  weightKg: 1.2,  certification: 'CE'      },
  { code: 'PROD-ST-7801', description: 'High-temperature Viton O-ring',      category: 'Accessory',   unitPrice: 45,   manufacturingTimeH: 1,  weightKg: 0.05, certification: 'AMS'     },
  { code: 'PROD-ST-7802', description: 'M8x40 titanium screw, aerospace grade', category: 'Accessory', unitPrice: 12, manufacturingTimeH: 0.5, weightKg: 0.02, certification: 'NAS'    },
]

// ─── CUSTOMER ORDERS ─────────────────────────────────────────

export const customerOrders: CustomerOrder[] = [
  { orderNumber: 'CMD-2026-001', customerId: 'CLI001', customerName: 'Lufthansa Technik',      orderDate: '2026-01-15', expectedDelivery: '2026-03-20', status: 'In production', totalAmount: 125000, priority: 'High',   salesManager: 'Sophie Martin' },
  { orderNumber: 'CMD-2026-002', customerId: 'CLI003', customerName: 'Boeing Supply Chain',    orderDate: '2026-01-17', expectedDelivery: '2026-03-05', status: 'In production', totalAmount: 89000,  priority: 'Urgent', salesManager: 'Marc Dubois'   },
  { orderNumber: 'CMD-2026-003', customerId: 'CLI005', customerName: 'Airbus Operations',      orderDate: '2026-01-20', expectedDelivery: '2026-04-15', status: 'Scheduled',     totalAmount: 245000, priority: 'Normal', salesManager: 'Sophie Martin' },
  { orderNumber: 'CMD-2026-004', customerId: 'CLI002', customerName: 'Air France Industries',  orderDate: '2026-01-23', expectedDelivery: '2026-03-15', status: 'In production', totalAmount: 67000,  priority: 'High',   salesManager: 'Julie Leroux'  },
  { orderNumber: 'CMD-2026-005', customerId: 'CLI006', customerName: 'DroneTech Industries',   orderDate: '2026-01-25', expectedDelivery: '2026-03-01', status: 'Completed',     totalAmount: 34500,  priority: 'Normal', salesManager: 'Marc Dubois'   },
  { orderNumber: 'CMD-2026-006', customerId: 'CLI010', customerName: 'Emirates Engineering',   orderDate: '2026-01-27', expectedDelivery: '2026-03-27', status: 'In production', totalAmount: 156000, priority: 'High',   salesManager: 'Sophie Martin' },
  { orderNumber: 'CMD-2026-007', customerId: 'CLI004', customerName: 'Safran Aircraft Engines',orderDate: '2026-01-30', expectedDelivery: '2026-03-10', status: 'In production', totalAmount: 98000,  priority: 'Urgent', salesManager: 'Julie Leroux'  },
  { orderNumber: 'CMD-2026-008', customerId: 'CLI007', customerName: 'AeroSystems Canada',     orderDate: '2026-02-02', expectedDelivery: '2026-04-11', status: 'Scheduled',     totalAmount: 52000,  priority: 'Normal', salesManager: 'Marc Dubois'   },
  { orderNumber: 'CMD-2026-009', customerId: 'CLI008', customerName: 'Nordic Aviation Parts',  orderDate: '2026-02-06', expectedDelivery: '2026-03-25', status: 'In production', totalAmount: 71000,  priority: 'Normal', salesManager: 'Julie Leroux'  },
  { orderNumber: 'CMD-2026-010', customerId: 'CLI009', customerName: 'Iberia Maintenance',     orderDate: '2026-02-10', expectedDelivery: '2026-04-09', status: 'Scheduled',     totalAmount: 89500,  priority: 'High',   salesManager: 'Sophie Martin' },
  { orderNumber: 'CMD-2026-011', customerId: 'CLI001', customerName: 'Lufthansa Technik',      orderDate: '2026-02-13', expectedDelivery: '2026-03-30', status: 'In production', totalAmount: 142000, priority: 'Urgent', salesManager: 'Sophie Martin' },
  { orderNumber: 'CMD-2026-012', customerId: 'CLI003', customerName: 'Boeing Supply Chain',    orderDate: '2026-02-15', expectedDelivery: '2026-04-05', status: 'Scheduled',     totalAmount: 198000, priority: 'Normal', salesManager: 'Marc Dubois'   },
]

// ─── PRODUCTION ORDERS ───────────────────────────────────────

export const productionOrders: ProductionOrder[] = [
  {
    id: '1', orderNumber: 'OF-2026-0045', product: 'AX series hydraulic valve',
    partNumber: 'PROD-AX-2401', quantity: 50, completed: 32,
    status: 'in_progress', priority: 'high',
    startDate: '2026-02-06', dueDate: '2026-02-20',
    workstation: 'Hydraulic-Cell-A', assignedTo: 'John Smith',
    batchId: 'LOT-AX-2401-001', site: 'Lyon site',
  },
  {
    id: '2', orderNumber: 'OF-2026-0046', product: '3/4" high-pressure fitting',
    partNumber: 'PROD-AX-2402', quantity: 150, completed: 150,
    status: 'quality_check', priority: 'high',
    startDate: '2026-02-07', dueDate: '2026-02-17',
    workstation: 'Hydraulic-Cell-B', assignedTo: 'Marie Blanc',
    batchId: 'LOT-AX-2402-001', site: 'Lyon site',
  },
  {
    id: '3', orderNumber: 'OF-2026-0047', product: 'Reinforced drive shaft',
    partNumber: 'PROD-MT-1105', quantity: 20, completed: 11,
    status: 'in_progress', priority: 'critical',
    startDate: '2026-02-08', dueDate: '2026-02-25',
    workstation: 'CNC-Mill-1', assignedTo: 'Pierre Martin',
    batchId: 'LOT-MT-1105-001', site: 'Toulouse site',
  },
  {
    id: '4', orderNumber: 'OF-2026-0048', product: 'Engine control module v2',
    partNumber: 'PROD-EL-3301', quantity: 5, completed: 0,
    status: 'pending', priority: 'medium',
    startDate: '2026-02-10', dueDate: '2026-02-23',
    workstation: 'Electronics-Lab-1', assignedTo: 'Sophie Leroy',
    batchId: 'LOT-EL-3301-001', site: 'Lyon site',
  },
  {
    id: '5', orderNumber: 'OF-2026-0049', product: 'CNC-machined aluminum housing',
    partNumber: 'PROD-MT-1106', quantity: 80, completed: 0,
    status: 'pending', priority: 'medium',
    startDate: '2026-02-15', dueDate: '2026-03-05',
    workstation: 'CNC-Mill-2', assignedTo: 'Pierre Martin',
    batchId: 'LOT-MT-1106-001', site: 'Toulouse site',
  },
  {
    id: '6', orderNumber: 'OF-2026-0050', product: 'Long-range drone camera mount',
    partNumber: 'PROD-DR-5501', quantity: 80, completed: 55,
    status: 'in_progress', priority: 'high',
    startDate: '2026-02-06', dueDate: '2026-02-19',
    workstation: 'Assembly-Line-2', assignedTo: 'Luc Bernard',
    batchId: 'LOT-DR-5501-001', site: 'Lyon site',
  },
  {
    id: '7', orderNumber: 'OF-2026-0051', product: 'Battery mounting system',
    partNumber: 'PROD-DR-5502', quantity: 50, completed: 50,
    status: 'completed', priority: 'medium',
    startDate: '2026-02-07', dueDate: '2026-02-18',
    workstation: 'Assembly-Line-2', assignedTo: 'Luc Bernard',
    batchId: 'LOT-DR-5502-001', site: 'Lyon site',
  },
  {
    id: '8', orderNumber: 'OF-2026-0052', product: 'High-temperature Viton O-ring',
    partNumber: 'PROD-ST-7801', quantity: 500, completed: 500,
    status: 'completed', priority: 'low',
    startDate: '2026-01-30', dueDate: '2026-02-10',
    workstation: 'Rubber-Press-1', assignedTo: 'Marie Blanc',
    batchId: 'LOT-ST-7801-001', site: 'Lyon site',
  },
  {
    id: '9', orderNumber: 'OF-2026-0054', product: 'AX series hydraulic valve',
    partNumber: 'PROD-AX-2401', quantity: 60, completed: 18,
    status: 'in_progress', priority: 'critical',
    startDate: '2026-02-13', dueDate: '2026-02-27',
    workstation: 'Hydraulic-Cell-A', assignedTo: 'John Smith',
    batchId: 'LOT-AX-2401-002', site: 'Lyon site',
  },
  {
    id: '10', orderNumber: 'OF-2026-0055', product: 'Reinforced drive shaft',
    partNumber: 'PROD-MT-1105', quantity: 25, completed: 8,
    status: 'in_progress', priority: 'critical',
    startDate: '2026-02-14', dueDate: '2026-03-02',
    workstation: 'CNC-Mill-1', assignedTo: 'Pierre Martin',
    batchId: 'LOT-MT-1105-002', site: 'Toulouse site',
  },
  {
    id: '11', orderNumber: 'OF-2026-0056', product: 'Engine control module v2',
    partNumber: 'PROD-EL-3301', quantity: 15, completed: 6,
    status: 'in_progress', priority: 'high',
    startDate: '2026-02-16', dueDate: '2026-03-01',
    workstation: 'Electronics-Lab-1', assignedTo: 'Sophie Leroy',
    batchId: 'LOT-EL-3301-002', site: 'Lyon site',
  },
]

// ─── INVENTORY ───────────────────────────────────────────────

export const inventoryItems: InventoryItem[] = [
  {
    id: '1', partNumber: 'MAT-ALU-6061', name: 'Aluminum 6061-T6 bar',
    category: 'raw_material', quantity: 2500, minStock: 500, maxStock: 4000, reservedStock: 450,
    unit: 'kg', location: 'Warehouse A — Bay 1', lastUpdated: '2026-02-06T08:00:00',
    supplier: 'MetalSupply France', unitCost: 3.80, batchNumbers: ['RM-ALU-2026-001'],
  },
  {
    id: '2', partNumber: 'MAT-STEEL-304', name: '304L stainless steel plate',
    category: 'raw_material', quantity: 1800, minStock: 400, maxStock: 3000, reservedStock: 320,
    unit: 'kg', location: 'Warehouse A — Bay 2', lastUpdated: '2026-02-02T14:00:00',
    supplier: 'ArcelorMittal', unitCost: 5.20, batchNumbers: ['RM-STEEL-2026-002'],
  },
  {
    id: '3', partNumber: 'MAT-TITAN-GR5', name: 'Grade 5 titanium billet',
    category: 'raw_material', quantity: 350, minStock: 100, maxStock: 800, reservedStock: 85,
    unit: 'kg', location: 'Warehouse A — Bay 3', lastUpdated: '2026-02-15T09:00:00',
    supplier: 'TIMET Europe', unitCost: 89.00, batchNumbers: ['RM-TITAN-2026-003', 'RM-TITAN-2026-004'],
  },
  {
    id: '4', partNumber: 'MAT-VITON-75', name: 'Viton hardness 75 Shore',
    category: 'raw_material', quantity: 180, minStock: 50, maxStock: 400, reservedStock: 25,
    unit: 'kg', location: 'Chemical Storage — Unit 1', lastUpdated: '2026-01-20T10:00:00',
    supplier: 'DuPont Polymers', unitCost: 42.00, batchNumbers: ['RM-VITON-2026-005'],
  },
  {
    id: '5', partNumber: 'MAT-ELECT-PCB', name: 'Multilayer printed circuit board',
    category: 'component', quantity: 850, minStock: 200, maxStock: 1500, reservedStock: 180,
    unit: 'unit', location: 'ESD Storage — Cabinet 1', lastUpdated: '2026-02-10T07:00:00',
    supplier: 'Eurocircuits', unitCost: 28.50, batchNumbers: ['CP-PCB-2026-006'],
  },
  {
    id: '6', partNumber: 'MAT-COMPO-RES', name: 'SMD resistors kit',
    category: 'component', quantity: 120, minStock: 30, maxStock: 300, reservedStock: 15,
    unit: 'set', location: 'ESD Storage — Cabinet 2', lastUpdated: '2026-01-25T11:00:00',
    supplier: 'RS Components', unitCost: 12.00, batchNumbers: ['CP-RES-2026-007'],
  },
  {
    id: '7', partNumber: 'MAT-VIS-M8', name: 'M8 aerospace titanium screws',
    category: 'component', quantity: 15000, minStock: 3000, maxStock: 25000, reservedStock: 2500,
    unit: 'unit', location: 'Warehouse B — Rack 5', lastUpdated: '2026-02-13T08:30:00',
    supplier: 'Lisi Aerospace', unitCost: 1.20, batchNumbers: ['CP-VIS-2026-008'],
  },
  {
    id: '8', partNumber: 'MAT-OIL-HYD', name: 'Skydrol hydraulic oil',
    category: 'component', quantity: 450, minStock: 100, maxStock: 1000, reservedStock: 60,
    unit: 'L', location: 'Chemical Storage — Unit 2', lastUpdated: '2026-01-30T09:00:00',
    supplier: 'Shell Aviation', unitCost: 18.50, batchNumbers: ['CP-OIL-2026-009'],
  },
  // Finished goods
  {
    id: '9', partNumber: 'PROD-AX-2401', name: 'AX series hydraulic valve',
    category: 'finished_good', quantity: 32, minStock: 10, maxStock: 100, reservedStock: 0,
    unit: 'unit', location: 'Finished Goods — Area A', lastUpdated: '2026-02-18T16:00:00',
    supplier: 'Internal', unitCost: 1250, batchNumbers: ['LOT-AX-2401-001'],
  },
  {
    id: '10', partNumber: 'PROD-DR-5502', name: 'Battery mounting system',
    category: 'finished_good', quantity: 50, minStock: 20, maxStock: 150, reservedStock: 0,
    unit: 'unit', location: 'Finished Goods — Area B', lastUpdated: '2026-02-18T14:00:00',
    supplier: 'Internal', unitCost: 420, batchNumbers: ['LOT-DR-5502-001'],
  },
]

// ─── BATCHES ─────────────────────────────────────────────────

export const batches: Batch[] = [
  {
    id: '1', batchNumber: 'LOT-AX-2401-001', product: 'AX series hydraulic valve',
    partNumber: 'PROD-AX-2401', quantity: 50, manufacturedDate: '2026-02-06',
    status: 'active', qualityCerts: ['EN9100', 'AS9100'],
    traceability: {
      rawMaterials: ['MAT-ALU-6061', 'MAT-OIL-HYD'],
      productionOrders: ['OF-2026-0045'],
      shipments: [],
    },
  },
  {
    id: '2', batchNumber: 'LOT-AX-2402-001', product: '3/4" high-pressure fitting',
    partNumber: 'PROD-AX-2402', quantity: 150, manufacturedDate: '2026-02-07',
    status: 'released', qualityCerts: ['EN9100'],
    traceability: {
      rawMaterials: ['MAT-ALU-6061', 'MAT-STEEL-304'],
      productionOrders: ['OF-2026-0046'],
      shipments: ['SHP-OUT-2026-002'],
    },
  },
  {
    id: '3', batchNumber: 'LOT-MT-1105-001', product: 'Reinforced drive shaft',
    partNumber: 'PROD-MT-1105', quantity: 20, manufacturedDate: '2026-02-08',
    status: 'active', qualityCerts: ['AS9100'],
    traceability: {
      rawMaterials: ['MAT-TITAN-GR5', 'MAT-STEEL-304'],
      productionOrders: ['OF-2026-0047'],
      shipments: [],
    },
  },
  {
    id: '4', batchNumber: 'LOT-EL-3301-001', product: 'Engine control module v2',
    partNumber: 'PROD-EL-3301', quantity: 5, manufacturedDate: '2026-02-10',
    status: 'quarantine', qualityCerts: ['DO-178C'],
    traceability: {
      rawMaterials: ['MAT-ELECT-PCB', 'MAT-COMPO-RES'],
      productionOrders: ['OF-2026-0048'],
      shipments: [],
    },
  },
  {
    id: '5', batchNumber: 'LOT-DR-5501-001', product: 'Long-range drone camera mount',
    partNumber: 'PROD-DR-5501', quantity: 80, manufacturedDate: '2026-02-06',
    status: 'active', qualityCerts: ['CE'],
    traceability: {
      rawMaterials: ['MAT-ALU-6061', 'MAT-VIS-M8'],
      productionOrders: ['OF-2026-0050'],
      shipments: [],
    },
  },
  {
    id: '6', batchNumber: 'LOT-DR-5502-001', product: 'Battery mounting system',
    partNumber: 'PROD-DR-5502', quantity: 50, manufacturedDate: '2026-02-07',
    status: 'released', qualityCerts: ['CE'],
    traceability: {
      rawMaterials: ['MAT-ALU-6061', 'MAT-VIS-M8'],
      productionOrders: ['OF-2026-0051'],
      shipments: ['SHP-OUT-2026-001'],
    },
  },
  {
    id: '7', batchNumber: 'LOT-ST-7801-001', product: 'High-temperature Viton O-ring',
    partNumber: 'PROD-ST-7801', quantity: 500, manufacturedDate: '2026-01-30',
    status: 'released', qualityCerts: ['AMS'],
    traceability: {
      rawMaterials: ['MAT-VITON-75'],
      productionOrders: ['OF-2026-0052'],
      shipments: ['SHP-OUT-2026-003'],
    },
  },
  {
    id: '8', batchNumber: 'LOT-AX-2401-002', product: 'AX series hydraulic valve',
    partNumber: 'PROD-AX-2401', quantity: 60, manufacturedDate: '2026-02-13',
    status: 'quarantine', qualityCerts: ['EN9100'],
    traceability: {
      rawMaterials: ['MAT-ALU-6061', 'MAT-OIL-HYD'],
      productionOrders: ['OF-2026-0054'],
      shipments: [],
    },
  },
]

// ─── SHIPMENTS ───────────────────────────────────────────────

export const shipments: Shipment[] = [
  {
    id: '1', shipmentNumber: 'SHP-IN-2026-001', type: 'inbound', status: 'in_transit',
    origin: 'TIMET Europe — Munich, Germany',
    destination: 'AERONEXIS — Toulouse site',
    carrier: 'DB Schenker', estimatedArrival: '2026-02-22',
    items: [{ partNumber: 'MAT-TITAN-GR5', quantity: 200, batchId: 'RM-TITAN-2026-004' }],
    priority: 'express',
  },
  {
    id: '2', shipmentNumber: 'SHP-OUT-2026-001', type: 'outbound', status: 'delivered',
    origin: 'AERONEXIS — Lyon site',
    destination: 'DroneTech Industries — London, UK',
    carrier: 'DHL Express', estimatedArrival: '2026-02-10', actualArrival: '2026-02-10',
    items: [
      { partNumber: 'PROD-DR-5502', quantity: 50, batchId: 'LOT-DR-5502-001' },
    ],
    priority: 'standard',
  },
  {
    id: '3', shipmentNumber: 'SHP-OUT-2026-002', type: 'outbound', status: 'scheduled',
    origin: 'AERONEXIS — Lyon site',
    destination: 'Lufthansa Technik — Hamburg, Germany',
    carrier: 'DB Schenker', estimatedArrival: '2026-02-25',
    items: [
      { partNumber: 'PROD-AX-2402', quantity: 150, batchId: 'LOT-AX-2402-001' },
      { partNumber: 'PROD-AX-2401', quantity: 50,  batchId: 'LOT-AX-2401-001' },
    ],
    priority: 'critical',
  },
  {
    id: '4', shipmentNumber: 'SHP-IN-2026-002', type: 'inbound', status: 'delayed',
    origin: 'ArcelorMittal — Dunkirk, France',
    destination: 'AERONEXIS — Lyon site',
    carrier: 'Geodis', estimatedArrival: '2026-02-15',
    items: [{ partNumber: 'MAT-STEEL-304', quantity: 500, batchId: 'RM-STEEL-2026-003' }],
    priority: 'standard',
  },
  {
    id: '5', shipmentNumber: 'SHP-OUT-2026-003', type: 'outbound', status: 'in_transit',
    origin: 'AERONEXIS — Lyon site',
    destination: 'Boeing Supply Chain — Seattle, USA',
    carrier: 'FedEx Freight', estimatedArrival: '2026-02-28',
    items: [{ partNumber: 'PROD-ST-7801', quantity: 500, batchId: 'LOT-ST-7801-001' }],
    priority: 'express',
  },
  {
    id: '6', shipmentNumber: 'SHP-IN-2026-003', type: 'inbound', status: 'scheduled',
    origin: 'Eurocircuits — Ghent, Belgium',
    destination: 'AERONEXIS — Lyon site',
    carrier: 'TNT', estimatedArrival: '2026-02-26',
    items: [{ partNumber: 'MAT-ELECT-PCB', quantity: 500, batchId: 'CP-PCB-2026-010' }],
    priority: 'express',
  },
]

// ─── INCIDENTS ───────────────────────────────────────────────

export const incidents: Incident[] = [
  {
    id: '1', incidentNumber: 'INC-2026-001', type: 'quality', severity: 'medium',
    status: 'resolved',
    title: 'Dimension out of tolerance — Hydraulic valve',
    description: 'Dimensional inspection of batch LOT-AX-2401-001 revealed bore diameter 0.04mm outside EN9100 tolerance band. CNC machine recalibrated, 12 affected units reworked.',
    location: 'Hydraulic-Cell-A — Lyon site',
    reportedBy: 'John Smith', reportedDate: '2026-02-02',
    assignedTo: 'Quality Team Lyon',
    resolution: 'CNC machine recalibration completed. All affected units reworked and re-inspected.',
    resolvedDate: '2026-02-04',
    affectedBatches: ['LOT-AX-2401-001'],
  },
  {
    id: '2', incidentNumber: 'INC-2026-002', type: 'quality', severity: 'low',
    status: 'investigating',
    title: 'Surface roughness non-conformance — Drive shaft',
    description: 'Surface roughness Ra measurement on batch LOT-MT-1105-001 exceeds AS9100 specification on 3 units. Polishing process under review.',
    location: 'CNC-Mill-1 — Toulouse site',
    reportedBy: 'Pierre Martin', reportedDate: '2026-02-07',
    assignedTo: 'Pierre Martin',
    affectedBatches: ['LOT-MT-1105-001'],
  },
  {
    id: '3', incidentNumber: 'INC-2026-003', type: 'quality', severity: 'critical',
    status: 'investigating',
    title: 'Welding defect — Engine control module',
    description: 'Visual and X-ray inspection detected micro-crack in solder joint on 2 units from batch LOT-EL-3301-001. Batch placed in quarantine pending full investigation. DO-178C compliance review initiated.',
    location: 'Electronics-Lab-1 — Lyon site',
    reportedBy: 'Sophie Leroy', reportedDate: '2026-02-10',
    assignedTo: 'Quality Team Lyon',
    affectedBatches: ['LOT-EL-3301-001'],
  },
  {
    id: '4', incidentNumber: 'INC-2026-004', type: 'quality', severity: 'low',
    status: 'resolved',
    title: 'Cosmetic scratch — Drone camera mount',
    description: 'Surface scratch detected during final packaging inspection on 4 units from batch LOT-DR-5501-001. Packaging process improved.',
    location: 'Assembly-Line-2 — Lyon site',
    reportedBy: 'Luc Bernard', reportedDate: '2026-02-13',
    assignedTo: 'Luc Bernard',
    resolution: 'Additional foam padding added to packaging. Affected units repainted and re-inspected.',
    resolvedDate: '2026-02-14',
    affectedBatches: ['LOT-DR-5501-001'],
  },
  {
    id: '5', incidentNumber: 'INC-2026-005', type: 'quality', severity: 'critical',
    status: 'open',
    title: 'Hydraulic leak test failure — AX valve batch 2',
    description: 'Pressure leak test at 350 bar detected seal failure on 8 units from batch LOT-AX-2401-002. Batch quarantined. Suspected root cause: incorrect Viton O-ring grade used during assembly.',
    location: 'Hydraulic-Cell-A — Lyon site',
    reportedBy: 'John Smith', reportedDate: '2026-02-15',
    affectedBatches: ['LOT-AX-2401-002'],
  },
]

// ─── KPI DATA ────────────────────────────────────────────────

export const kpiData: KPIData = {
  oee: 88.3,
  productionYield: 91.7,
  onTimeDelivery: 88.5,
  defectRate: 2.1,
  inventoryTurnover: 5.8,
  capacityUtilization: 82.4,
  mtbf: 1840,
  mttr: 5.5,
}

export const kpiHistory = [
  { month: 'Oct', oee: 94.1, yield: 94.1, otd: 96.2, defectRate: 0.8 },
  { month: 'Nov', oee: 91.7, yield: 91.7, otd: 93.5, defectRate: 1.1 },
  { month: 'Dec', oee: 92.5, yield: 92.5, otd: 94.1, defectRate: 0.9 },
  { month: 'Jan', oee: 88.3, yield: 88.3, otd: 90.0, defectRate: 2.1 },
  { month: 'Feb', oee: 86.1, yield: 87.4, otd: 88.5, defectRate: 2.4 },
]

export const productionByCategory = [
  { name: 'Hydraulic',   value: 35, color: 'var(--chart-1)' },
  { name: 'Mechanical',  value: 28, color: 'var(--chart-2)' },
  { name: 'Electronics', value: 18, color: 'var(--chart-3)' },
  { name: 'Drone',       value: 13, color: 'var(--chart-4)' },
  { name: 'Accessory',   value: 6,  color: 'var(--chart-5)' },
]

export const inventoryTrend = [
  { date: '01/02', rawMaterials: 4.8, components: 1.2, finished: 0.4 },
  { date: '01/06', rawMaterials: 4.6, components: 1.3, finished: 0.6 },
  { date: '01/10', rawMaterials: 4.9, components: 1.1, finished: 0.8 },
  { date: '01/15', rawMaterials: 4.5, components: 1.4, finished: 0.9 },
  { date: '01/20', rawMaterials: 4.7, components: 1.2, finished: 0.7 },
  { date: '02/06', rawMaterials: 4.3, components: 1.5, finished: 1.1 },
]
