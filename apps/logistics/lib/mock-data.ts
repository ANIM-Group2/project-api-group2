// Mock data for the aerospace ERP dashboard

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
}

export interface InventoryItem {
  id: string
  partNumber: string
  name: string
  category: 'raw_material' | 'component' | 'assembly' | 'finished_good'
  quantity: number
  minStock: number
  maxStock: number
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
  oee: number // Overall Equipment Effectiveness
  productionYield: number
  onTimeDelivery: number
  defectRate: number
  inventoryTurnover: number
  capacityUtilization: number
  mtbf: number // Mean Time Between Failures (hours)
  mttr: number // Mean Time To Repair (hours)
}

// Production Orders
export const productionOrders: ProductionOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    product: 'Turbine Blade Assembly',
    partNumber: 'TBA-7500-A',
    quantity: 24,
    completed: 18,
    status: 'in_progress',
    priority: 'high',
    startDate: '2024-01-15',
    dueDate: '2024-01-28',
    workstation: 'CNC-Cell-A',
    assignedTo: 'Team Alpha',
    batchId: 'BTH-2024-0115',
  },
  {
    id: '2',
    orderNumber: 'PO-2024-002',
    product: 'Landing Gear Strut',
    partNumber: 'LGS-4200-B',
    quantity: 12,
    completed: 12,
    status: 'quality_check',
    priority: 'critical',
    startDate: '2024-01-10',
    dueDate: '2024-01-20',
    workstation: 'Assembly-Line-1',
    assignedTo: 'Team Bravo',
    batchId: 'BTH-2024-0110',
  },
  {
    id: '3',
    orderNumber: 'PO-2024-003',
    product: 'Avionics Housing Unit',
    partNumber: 'AHU-3300-C',
    quantity: 50,
    completed: 0,
    status: 'pending',
    priority: 'medium',
    startDate: '2024-01-22',
    dueDate: '2024-02-05',
    workstation: 'Precision-Mill-2',
    assignedTo: 'Team Charlie',
    batchId: 'BTH-2024-0122',
  },
  {
    id: '4',
    orderNumber: 'PO-2024-004',
    product: 'Hydraulic Actuator',
    partNumber: 'HAC-6100-D',
    quantity: 36,
    completed: 36,
    status: 'completed',
    priority: 'medium',
    startDate: '2024-01-05',
    dueDate: '2024-01-18',
    workstation: 'Assembly-Line-2',
    assignedTo: 'Team Delta',
    batchId: 'BTH-2024-0105',
  },
  {
    id: '5',
    orderNumber: 'PO-2024-005',
    product: 'Composite Wing Panel',
    partNumber: 'CWP-8800-E',
    quantity: 8,
    completed: 3,
    status: 'on_hold',
    priority: 'high',
    startDate: '2024-01-12',
    dueDate: '2024-01-30',
    workstation: 'Autoclave-1',
    assignedTo: 'Team Echo',
    batchId: 'BTH-2024-0112',
  },
  {
    id: '6',
    orderNumber: 'PO-2024-006',
    product: 'Fuel System Manifold',
    partNumber: 'FSM-2200-F',
    quantity: 20,
    completed: 15,
    status: 'in_progress',
    priority: 'critical',
    startDate: '2024-01-08',
    dueDate: '2024-01-22',
    workstation: 'CNC-Cell-B',
    assignedTo: 'Team Foxtrot',
    batchId: 'BTH-2024-0108',
  },
]

// Inventory Items
export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    partNumber: 'TI-6AL4V-PLT-01',
    name: 'Titanium Alloy Plate (Grade 5)',
    category: 'raw_material',
    quantity: 450,
    minStock: 200,
    maxStock: 800,
    unit: 'kg',
    location: 'Warehouse A - Bay 1',
    lastUpdated: '2024-01-18T08:30:00',
    supplier: 'Titanium Industries Inc.',
    unitCost: 89.50,
    batchNumbers: ['RM-TI-2024-001', 'RM-TI-2024-002'],
  },
  {
    id: '2',
    partNumber: 'AL-7075-BAR-02',
    name: 'Aluminum 7075-T6 Bar Stock',
    category: 'raw_material',
    quantity: 120,
    minStock: 150,
    maxStock: 500,
    unit: 'units',
    location: 'Warehouse A - Bay 3',
    lastUpdated: '2024-01-17T14:45:00',
    supplier: 'AeroMetal Supply',
    unitCost: 245.00,
    batchNumbers: ['RM-AL-2024-003'],
  },
  {
    id: '3',
    partNumber: 'HYD-SLV-5500',
    name: 'Hydraulic Sleeve Assembly',
    category: 'component',
    quantity: 85,
    minStock: 50,
    maxStock: 200,
    unit: 'units',
    location: 'Warehouse B - Rack 12',
    lastUpdated: '2024-01-18T10:15:00',
    supplier: 'HydroTech Components',
    unitCost: 1250.00,
    batchNumbers: ['CP-HYD-2024-005', 'CP-HYD-2024-006'],
  },
  {
    id: '4',
    partNumber: 'CFRP-PLY-300',
    name: 'Carbon Fiber Prepreg (300gsm)',
    category: 'raw_material',
    quantity: 2800,
    minStock: 1000,
    maxStock: 5000,
    unit: 'sqm',
    location: 'Cold Storage - Unit 2',
    lastUpdated: '2024-01-16T09:00:00',
    supplier: 'CompositeTech Ltd.',
    unitCost: 175.00,
    batchNumbers: ['RM-CF-2024-008', 'RM-CF-2024-009'],
  },
  {
    id: '5',
    partNumber: 'TBA-7500-A',
    name: 'Turbine Blade Assembly',
    category: 'finished_good',
    quantity: 42,
    minStock: 20,
    maxStock: 100,
    unit: 'units',
    location: 'Finished Goods - Area C',
    lastUpdated: '2024-01-18T16:30:00',
    supplier: 'Internal',
    unitCost: 15800.00,
    batchNumbers: ['BTH-2024-0102', 'BTH-2024-0108'],
  },
  {
    id: '6',
    partNumber: 'SEAL-VTN-88',
    name: 'Viton O-Ring Seal Kit',
    category: 'component',
    quantity: 520,
    minStock: 300,
    maxStock: 1000,
    unit: 'kits',
    location: 'Warehouse B - Rack 5',
    lastUpdated: '2024-01-17T11:20:00',
    supplier: 'SealMaster Corp.',
    unitCost: 45.00,
    batchNumbers: ['CP-SEAL-2024-011'],
  },
  {
    id: '7',
    partNumber: 'INCO-718-RND',
    name: 'Inconel 718 Round Bar',
    category: 'raw_material',
    quantity: 65,
    minStock: 100,
    maxStock: 300,
    unit: 'units',
    location: 'Warehouse A - Bay 2',
    lastUpdated: '2024-01-15T13:45:00',
    supplier: 'SuperAlloy Metals',
    unitCost: 890.00,
    batchNumbers: ['RM-IN-2024-004'],
  },
  {
    id: '8',
    partNumber: 'PCB-NAV-200',
    name: 'Navigation System PCB',
    category: 'component',
    quantity: 28,
    minStock: 25,
    maxStock: 100,
    unit: 'units',
    location: 'ESD Storage - Cabinet 3',
    lastUpdated: '2024-01-18T07:00:00',
    supplier: 'AeroElectronics',
    unitCost: 3400.00,
    batchNumbers: ['CP-PCB-2024-015'],
  },
]

// Batches
export const batches: Batch[] = [
  {
    id: '1',
    batchNumber: 'BTH-2024-0115',
    product: 'Turbine Blade Assembly',
    partNumber: 'TBA-7500-A',
    quantity: 24,
    manufacturedDate: '2024-01-15',
    status: 'active',
    qualityCerts: ['AS9100D', 'NADCAP-AC7004'],
    traceability: {
      rawMaterials: ['RM-TI-2024-001', 'RM-IN-2024-004'],
      productionOrders: ['PO-2024-001'],
      shipments: [],
    },
  },
  {
    id: '2',
    batchNumber: 'BTH-2024-0110',
    product: 'Landing Gear Strut',
    partNumber: 'LGS-4200-B',
    quantity: 12,
    manufacturedDate: '2024-01-10',
    status: 'released',
    qualityCerts: ['AS9100D', 'NADCAP-AC7110', 'MIL-STD-1530D'],
    traceability: {
      rawMaterials: ['RM-AL-2024-003', 'CP-HYD-2024-005'],
      productionOrders: ['PO-2024-002'],
      shipments: ['SHP-OUT-2024-005'],
    },
  },
  {
    id: '3',
    batchNumber: 'BTH-2024-0112',
    product: 'Composite Wing Panel',
    partNumber: 'CWP-8800-E',
    quantity: 8,
    manufacturedDate: '2024-01-12',
    status: 'quarantine',
    qualityCerts: ['AS9100D'],
    traceability: {
      rawMaterials: ['RM-CF-2024-008'],
      productionOrders: ['PO-2024-005'],
      shipments: [],
    },
  },
  {
    id: '4',
    batchNumber: 'BTH-2024-0105',
    product: 'Hydraulic Actuator',
    partNumber: 'HAC-6100-D',
    quantity: 36,
    manufacturedDate: '2024-01-05',
    status: 'released',
    qualityCerts: ['AS9100D', 'SAE-AS6081'],
    traceability: {
      rawMaterials: ['RM-AL-2024-002', 'CP-HYD-2024-006', 'CP-SEAL-2024-011'],
      productionOrders: ['PO-2024-004'],
      shipments: ['SHP-OUT-2024-003', 'SHP-OUT-2024-004'],
    },
  },
  {
    id: '5',
    batchNumber: 'BTH-2024-0108',
    product: 'Fuel System Manifold',
    partNumber: 'FSM-2200-F',
    quantity: 20,
    manufacturedDate: '2024-01-08',
    status: 'active',
    qualityCerts: ['AS9100D', 'NADCAP-AC7004'],
    traceability: {
      rawMaterials: ['RM-TI-2024-002', 'CP-SEAL-2024-011'],
      productionOrders: ['PO-2024-006'],
      shipments: [],
    },
  },
]

// Shipments
export const shipments: Shipment[] = [
  {
    id: '1',
    shipmentNumber: 'SHP-IN-2024-012',
    type: 'inbound',
    status: 'in_transit',
    origin: 'Titanium Industries Inc. - Phoenix, AZ',
    destination: 'AERONEXIS HQ - Seattle, WA',
    carrier: 'FedEx Freight',
    estimatedArrival: '2024-01-20',
    items: [{ partNumber: 'TI-6AL4V-PLT-01', quantity: 200, batchId: 'RM-TI-2024-003' }],
    priority: 'express',
  },
  {
    id: '2',
    shipmentNumber: 'SHP-OUT-2024-008',
    type: 'outbound',
    status: 'scheduled',
    origin: 'AERONEXIS HQ - Seattle, WA',
    destination: 'Boeing - Everett, WA',
    carrier: 'XPO Logistics',
    estimatedArrival: '2024-01-22',
    items: [
      { partNumber: 'TBA-7500-A', quantity: 12, batchId: 'BTH-2024-0115' },
      { partNumber: 'FSM-2200-F', quantity: 8, batchId: 'BTH-2024-0108' },
    ],
    priority: 'critical',
  },
  {
    id: '3',
    shipmentNumber: 'SHP-IN-2024-013',
    type: 'inbound',
    status: 'delivered',
    origin: 'CompositeTech Ltd. - Salt Lake City, UT',
    destination: 'AERONEXIS HQ - Seattle, WA',
    carrier: 'UPS Freight',
    estimatedArrival: '2024-01-15',
    actualArrival: '2024-01-15',
    items: [{ partNumber: 'CFRP-PLY-300', quantity: 1500, batchId: 'RM-CF-2024-009' }],
    priority: 'standard',
  },
  {
    id: '4',
    shipmentNumber: 'SHP-OUT-2024-009',
    type: 'outbound',
    status: 'delayed',
    origin: 'AERONEXIS HQ - Seattle, WA',
    destination: 'Lockheed Martin - Palmdale, CA',
    carrier: 'ABF Freight',
    estimatedArrival: '2024-01-18',
    items: [{ partNumber: 'HAC-6100-D', quantity: 18, batchId: 'BTH-2024-0105' }],
    priority: 'express',
  },
  {
    id: '5',
    shipmentNumber: 'SHP-IN-2024-014',
    type: 'inbound',
    status: 'scheduled',
    origin: 'AeroElectronics - San Jose, CA',
    destination: 'AERONEXIS HQ - Seattle, WA',
    carrier: 'FedEx Express',
    estimatedArrival: '2024-01-25',
    items: [{ partNumber: 'PCB-NAV-200', quantity: 50, batchId: 'CP-PCB-2024-016' }],
    priority: 'express',
  },
  {
    id: '6',
    shipmentNumber: 'SHP-OUT-2024-010',
    type: 'outbound',
    status: 'in_transit',
    origin: 'AERONEXIS HQ - Seattle, WA',
    destination: 'Northrop Grumman - El Segundo, CA',
    carrier: 'Estes Express',
    estimatedArrival: '2024-01-21',
    items: [{ partNumber: 'LGS-4200-B', quantity: 6, batchId: 'BTH-2024-0110' }],
    priority: 'standard',
  },
]

// Incidents
export const incidents: Incident[] = [
  {
    id: '1',
    incidentNumber: 'INC-2024-001',
    type: 'quality',
    severity: 'high',
    status: 'investigating',
    title: 'Surface Finish Non-Conformance on Wing Panels',
    description: 'Visual inspection revealed surface porosity exceeding acceptable limits on composite wing panels from batch BTH-2024-0112.',
    location: 'Autoclave-1',
    reportedBy: 'Aiko Tanaka',
    reportedDate: '2024-01-16',
    assignedTo: 'Quality Team A',
    affectedBatches: ['BTH-2024-0112'],
  },
  {
    id: '2',
    incidentNumber: 'INC-2024-002',
    type: 'equipment',
    severity: 'medium',
    status: 'resolved',
    title: 'CNC Spindle Vibration Anomaly',
    description: 'Unexpected vibration detected on CNC-Cell-A spindle during high-speed machining operations.',
    location: 'CNC-Cell-A',
    reportedBy: 'Marcus Rivera',
    reportedDate: '2024-01-14',
    assignedTo: 'Maintenance Team',
    resolution: 'Spindle bearing replaced and recalibrated. Machine returned to service after verification.',
    resolvedDate: '2024-01-15',
  },
  {
    id: '3',
    incidentNumber: 'INC-2024-003',
    type: 'safety',
    severity: 'low',
    status: 'closed',
    title: 'Near Miss - Forklift Traffic',
    description: 'Near miss incident between pedestrian and forklift in Warehouse A loading area.',
    location: 'Warehouse A - Loading Dock',
    reportedBy: 'James Okonkwo',
    reportedDate: '2024-01-12',
    assignedTo: 'Safety Officer',
    resolution: 'Additional signage installed. Traffic flow patterns reviewed and updated.',
    resolvedDate: '2024-01-13',
  },
  {
    id: '4',
    incidentNumber: 'INC-2024-004',
    type: 'process',
    severity: 'critical',
    status: 'open',
    title: 'Material Certification Gap Identified',
    description: 'Audit revealed missing material certification for incoming titanium batch RM-TI-2024-002.',
    location: 'Receiving Inspection',
    reportedBy: 'Elena Kowalski',
    reportedDate: '2024-01-18',
    affectedBatches: ['BTH-2024-0108'],
  },
  {
    id: '5',
    incidentNumber: 'INC-2024-005',
    type: 'environmental',
    severity: 'medium',
    status: 'investigating',
    title: 'Coolant Leak Detection',
    description: 'Coolant leak detected in secondary containment of CNC-Cell-B machine.',
    location: 'CNC-Cell-B',
    reportedBy: 'Marcus Rivera',
    reportedDate: '2024-01-17',
    assignedTo: 'Environmental Team',
  },
]

// KPI Data
export const kpiData: KPIData = {
  oee: 84.5,
  productionYield: 97.2,
  onTimeDelivery: 91.8,
  defectRate: 0.8,
  inventoryTurnover: 6.4,
  capacityUtilization: 78.3,
  mtbf: 2840,
  mttr: 4.2,
}

// Historical KPI data for charts
export const kpiHistory = [
  { month: 'Aug', oee: 81.2, yield: 95.8, otd: 88.5, defectRate: 1.2 },
  { month: 'Sep', oee: 82.8, yield: 96.1, otd: 89.2, defectRate: 1.1 },
  { month: 'Oct', oee: 83.5, yield: 96.5, otd: 90.1, defectRate: 1.0 },
  { month: 'Nov', oee: 82.9, yield: 96.8, otd: 90.8, defectRate: 0.9 },
  { month: 'Dec', oee: 84.1, yield: 97.0, otd: 91.2, defectRate: 0.85 },
  { month: 'Jan', oee: 84.5, yield: 97.2, otd: 91.8, defectRate: 0.8 },
]

// Production by category
export const productionByCategory = [
  { name: 'Propulsion', value: 32, color: 'var(--chart-1)' },
  { name: 'Structures', value: 28, color: 'var(--chart-2)' },
  { name: 'Hydraulics', value: 18, color: 'var(--chart-3)' },
  { name: 'Avionics', value: 14, color: 'var(--chart-4)' },
  { name: 'Other', value: 8, color: 'var(--chart-5)' },
]

// Inventory levels over time
export const inventoryTrend = [
  { date: '01/01', rawMaterials: 2.4, components: 1.8, finished: 0.9 },
  { date: '01/05', rawMaterials: 2.2, components: 1.9, finished: 1.1 },
  { date: '01/10', rawMaterials: 2.6, components: 1.7, finished: 1.0 },
  { date: '01/15', rawMaterials: 2.3, components: 2.0, finished: 1.2 },
  { date: '01/18', rawMaterials: 2.5, components: 1.8, finished: 1.1 },
]
