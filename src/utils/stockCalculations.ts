import { Warehouse, StockLevel, Tank } from '../types/warehouse';

export const calculateTotalStock = (warehouses: Warehouse[]): StockLevel => {
  return warehouses.reduce(
    (total, warehouse) => ({
      uco: total.uco + warehouse.totalCurrentStock.uco,
      cpo: total.cpo + warehouse.totalCurrentStock.cpo
    }),
    { uco: 0, cpo: 0 }
  );
};

export const calculateTotalCapacity = (warehouses: Warehouse[]): StockLevel => {
  return warehouses.reduce(
    (total, warehouse) => ({
      uco: total.uco + warehouse.totalCapacity.uco,
      cpo: total.cpo + warehouse.totalCapacity.cpo
    }),
    { uco: 0, cpo: 0 }
  );
};

export const calculateStockPercentage = (current: number, capacity: number): number => {
  return Math.round((current / capacity) * 100);
};

export const formatStockAmount = (amount: number): string => {
  return `${amount.toLocaleString('id-ID')} kg`;
};

export const getStockLevelColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-red-400';
  if (percentage >= 60) return 'text-yellow-400';
  if (percentage >= 40) return 'text-green-400';
  return 'text-blue-400';
};

export const getStockLevelBgColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 60) return 'bg-yellow-500';
  if (percentage >= 40) return 'bg-green-500';
  return 'bg-blue-500';
};

export const updateWarehouseTotals = (warehouse: Warehouse): Warehouse => {
  const totalCapacity = warehouse.tanks.reduce(
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

  const totalCurrentStock = warehouse.tanks.reduce(
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

  return {
    ...warehouse,
    totalCapacity,
    totalCurrentStock,
    lastUpdated: new Date()
  };
};