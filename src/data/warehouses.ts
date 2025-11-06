import { Warehouse, Tank } from '../types/warehouse';

// Tandon untuk Gudang Ploso (8 tandon) dengan kapasitas sesuai spesifikasi
const plosoTanks: Tank[] = [
  {
    id: 'ploso-tank-1',
    name: 'Tandon 1',
    capacity: 71630,
    currentStock: 18000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'ploso-tank-2',
    name: 'Tandon 2',
    capacity: 26767.40,
    currentStock: 20000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'ploso-tank-3',
    name: 'Tandon 3',
    capacity: 16000,
    currentStock: 12000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'ploso-tank-4',
    name: 'Tandon 4',
    capacity: 16000,
    currentStock: 11000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'ploso-tank-5',
    name: 'Tandon 5',
    capacity: 189750,
    currentStock: 150000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'ploso-tank-6',
    name: 'Tandon 6',
    capacity: 189750,
    currentStock: 160000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'ploso-tank-7',
    name: 'Tandon 7',
    capacity: 189750,
    currentStock: 170000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'ploso-tank-8',
    name: 'Tandon 8',
    capacity: 121500,
    currentStock: 0,
    oilType: 'Empty',
    lastUpdated: new Date()
  }
];

// Tandon untuk Gudang Kepuh Kemiri (5 tandon) dengan kapasitas sesuai spesifikasi
const kemiriTanks: Tank[] = [
  {
    id: 'kemiri-tank-1',
    name: 'Tandon 1',
    capacity: 42120,
    currentStock: 35000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'kemiri-tank-2',
    name: 'Tandon 2',
    capacity: 23000,
    currentStock: 18000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'kemiri-tank-3',
    name: 'Tandon 3',
    capacity: 23874,
    currentStock: 17000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'kemiri-tank-4',
    name: 'Tandon 4',
    capacity: 20000,
    currentStock: 15000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'kemiri-tank-5',
    name: 'Tandon 5',
    capacity: 20000,
    currentStock: 16000,
    oilType: 'UCO',
    lastUpdated: new Date()
  }
];

// Tandon untuk Gudang Safe n Lock (6 tandon) dengan kapasitas sama 106.000kg
const safeNLockTanks: Tank[] = [
  {
    id: 'safenlock-tank-1',
    name: 'Tandon 1',
    capacity: 116000,
    currentStock: 85000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'safenlock-tank-2',
    name: 'Tandon 2',
    capacity: 106000,
    currentStock: 90000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'safenlock-tank-3',
    name: 'Tandon 3',
    capacity: 106000,
    currentStock: 75000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'safenlock-tank-4',
    name: 'Tandon 4',
    capacity: 106000,
    currentStock: 80000,
    oilType: 'UCO',
    lastUpdated: new Date()
  },
  {
    id: 'safenlock-tank-5',
    name: 'Tandon 5',
    capacity: 106000,
    currentStock: 0,
    oilType: 'Empty',
    lastUpdated: new Date()
  },
  {
    id: 'safenlock-tank-6',
    name: 'Tandon 6',
    capacity: 106000,
    currentStock: 0,
    oilType: 'Empty',
    lastUpdated: new Date()
  }
];

const calculateWarehouseTotals = (tanks: Tank[]) => {
  const totalCapacity = tanks.reduce(
    (total, tank) => {
      if (tank.oilType === 'UCO') {
        total.uco += tank.capacity;
      } else if (tank.oilType === 'CPO') {
        total.cpo += tank.capacity;
      }
      return total;
    },
    { uco: 0, cpo: 0 }
  );

  const totalCurrentStock = tanks.reduce(
    (total, tank) => {
      if (tank.oilType === 'UCO') {
        total.uco += tank.currentStock;
      } else if (tank.oilType === 'CPO') {
        total.cpo += tank.currentStock;
      }
      return total;
    },
    { uco: 0, cpo: 0 }
  );

  return { totalCapacity, totalCurrentStock };
};

export const initialWarehouses: Warehouse[] = [
  {
    id: 'wh-ploso',
    name: 'Gudang Ploso',
    location: 'Jl. Ploso Raya No. 123',
    tanks: plosoTanks,
    ...calculateWarehouseTotals(plosoTanks),
    lastUpdated: new Date()
  },
  {
    id: 'wh-kemiri',
    name: 'Gudang Kepuh Kemiri',
    location: 'Jl. Kepuh Kemiri Indah No. 456',
    tanks: kemiriTanks,
    ...calculateWarehouseTotals(kemiriTanks),
    lastUpdated: new Date()
  },
  {
    id: 'wh-safenlock',
    name: 'Gudang Safe n Lock',
    location: 'Jl. Safe n Lock Plaza No. 789',
    tanks: safeNLockTanks,
    ...calculateWarehouseTotals(safeNLockTanks),
    lastUpdated: new Date()
  }
];