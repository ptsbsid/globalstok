export interface StockLevel {
  uco: number; // Used Cooking Oil dalam kg
  cpo: number; // Crude Palm Oil dalam kg
}

export interface Tank {
  id: string;
  name: string;
  capacity: number; // Kapasitas total tandon dalam kg
  currentStock: number; // Stok saat ini dalam kg
  oilType: 'UCO' | 'CPO' | 'Empty'; // Jenis minyak yang disimpan di tandon
  lastUpdated: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  tanks: Tank[];
  totalCapacity: StockLevel; // Ini akan tetap sebagai StockLevel untuk total gudang
  totalCurrentStock: StockLevel; // Ini juga akan tetap sebagai StockLevel untuk total gudang
  lastUpdated: Date;
}

export interface StockUpdate {
  warehouseId: string;
  tankId: string;
  date: Date;
  previousStock: StockLevel;
  newStock: StockLevel;
  updatedBy: string;
}

export interface DailyReport {
  date: Date;
  warehouses: Warehouse[];
  totalStock: StockLevel;
}