import React, { useState, useEffect, useRef } from 'react';
import { Warehouse, StockLevel, Tank } from './types/warehouse';
import { initialWarehouses } from './data/warehouses';
import { calculateTotalStock, calculateTotalCapacity, updateWarehouseTotals } from './utils/stockCalculations';
import { WarehouseCard } from './components/WarehouseCard';
import { TankUpdateModal } from './components/TankUpdateModal';
import { TotalStockSummary } from './components/TotalStockSummary';
import { ReportExporter, exportToPNG } from './components/ReportExporter';
import { Factory, Calendar, RefreshCw, Download, Wifi, WifiOff } from 'lucide-react';
import { 
  saveWarehousesToFirestore, 
  loadWarehousesFromFirestore, 
  subscribeToWarehouses,
  initializeFirestore 
} from './services/firebaseService';

// Helper function to revive Date objects from JSON strings
const reviveDates = (key: string, value: any): any => {
  if (key === 'lastUpdated' && typeof value === 'string') {
    // Check if the string matches ISO 8601 format (e.g., '2023-10-27T10:00:00.000Z')
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (dateRegex.test(value)) {
      return new Date(value);
    }
  }
  return value;
};

// Helper function to transform old warehouse data structure to new one
const transformOldWarehouseData = (oldWarehouses: any[]): Warehouse[] => {
  return oldWarehouses.map(warehouse => {
    const transformedTanks = warehouse.tanks.map((tank: any) => {
      let currentStock: number;
      let capacity: number;
      let oilType: 'UCO' | 'CPO' | 'Empty' = 'Empty';

      if (typeof tank.capacity === 'object' && tank.capacity !== null) {
        // Old structure: { uco: number, cpo: number }
        if (tank.currentStock.uco >= tank.currentStock.cpo) {
          currentStock = tank.currentStock.uco;
          capacity = tank.capacity.uco;
          oilType = 'UCO';
        } else {
          currentStock = tank.currentStock.cpo;
          capacity = tank.capacity.cpo;
          oilType = 'CPO';
        }
      } else {
        // New structure already, or initial load
        currentStock = tank.currentStock;
        capacity = tank.capacity;
        oilType = tank.oilType || 'Empty';
      }

      return { ...tank, currentStock, capacity, oilType };
    });

    // Create a new warehouse object with updated tanks
    const newWarehouse = { ...warehouse, tanks: transformedTanks };

    // Recalculate totals for the warehouse based on new tank structure
    return updateWarehouseTotals(newWarehouse);
  });
};

function App() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    // Force reload from initial data to get the latest changes
    return initialWarehouses;
  });
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const firebaseInitialized = useRef(false);

  // Initialize Firebase and load data
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const initializeData = async () => {
      try {
        // Check if Firebase config is available
        const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        
        if (hasFirebaseConfig) {
          // Initialize Firestore with default data if empty
          await initializeFirestore(initialWarehouses);
          
          // Load data from Firestore
          const firestoreData = await loadWarehousesFromFirestore();
          
          if (firestoreData && firestoreData.length > 0) {
            setWarehouses(firestoreData);
            setIsFirebaseConnected(true);
          } else {
            // Fallback to localStorage or initial data
            const localData = localStorage.getItem('stokAppWarehouses');
            if (localData) {
              try {
                const parsed = JSON.parse(localData, reviveDates);
                setWarehouses(transformOldWarehouseData(parsed));
              } catch {
                setWarehouses(initialWarehouses);
              }
            } else {
              setWarehouses(initialWarehouses);
            }
          }
          
          // Subscribe to real-time updates
          unsubscribe = subscribeToWarehouses((updatedWarehouses) => {
            if (updatedWarehouses.length > 0) {
              setWarehouses(updatedWarehouses);
              setIsFirebaseConnected(true);
            }
          });
        } else {
          // No Firebase config, use localStorage
          const localData = localStorage.getItem('stokAppWarehouses');
          if (localData) {
            try {
              const parsed = JSON.parse(localData, reviveDates);
              setWarehouses(transformOldWarehouseData(parsed));
            } catch {
              setWarehouses(initialWarehouses);
            }
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem('stokAppWarehouses');
        if (localData) {
          try {
            const parsed = JSON.parse(localData, reviveDates);
            setWarehouses(transformOldWarehouseData(parsed));
          } catch {
            setWarehouses(initialWarehouses);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!firebaseInitialized.current) {
      firebaseInitialized.current = true;
      initializeData();
    }
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Save to both localStorage and Firestore when warehouses change
  useEffect(() => {
    if (!isLoading && warehouses.length > 0) {
      // Always save to localStorage as backup
      localStorage.setItem('stokAppWarehouses', JSON.stringify(warehouses));
      
      // Save to Firestore if connected
      const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      if (hasFirebaseConfig && firebaseInitialized.current) {
        saveWarehousesToFirestore(warehouses).catch((error) => {
          console.error('Error saving to Firestore:', error);
          setIsFirebaseConnected(false);
        });
      }
    }
  }, [warehouses, isLoading]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalStock = calculateTotalStock(warehouses);
  const totalCapacity = calculateTotalCapacity(warehouses);

  const handleUpdateTankStock = async (warehouseId: string, tankId: string, newStock: number, newOilType: 'UCO' | 'CPO' | 'Empty') => {
    const updatedWarehouses = warehouses.map(warehouse => {
      if (warehouse.id === warehouseId) {
        const updatedTanks = warehouse.tanks.map(tank =>
          tank.id === tankId 
            ? { ...tank, currentStock: newStock, oilType: newOilType, lastUpdated: new Date() }
            : tank
        );
        return updateWarehouseTotals({ ...warehouse, tanks: updatedTanks });
      }
      return warehouse;
    });
    
    setWarehouses(updatedWarehouses);
    
    // Save to Firestore immediately
    const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    if (hasFirebaseConfig) {
      try {
        await saveWarehousesToFirestore(updatedWarehouses);
        setIsFirebaseConnected(true);
      } catch (error) {
        console.error('Error saving to Firestore:', error);
        setIsFirebaseConnected(false);
      }
    }
  };

  const handleTankUpdate = (warehouse: Warehouse, tankId: string) => {
    const tank = warehouse.tanks.find(t => t.id === tankId);
    if (tank) {
      setSelectedWarehouse(warehouse);
      setSelectedTank(tank);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWarehouse(null);
    setSelectedTank(null);
  };

  const exportJSONReport = () => {
    const report = {
      tanggal: new Date().toISOString(),
      gudang: warehouses,
      totalStok: totalStock,
      totalKapasitas: totalCapacity
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `laporan-gudang-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportPNGReport = async () => {
    const filename = `laporan-gudang-${new Date().toISOString().split('T')[0]}.png`;
    await exportToPNG('main-content', filename);
  };

  const totalTanks = warehouses.reduce((total, warehouse) => total + warehouse.tanks.length, 0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk handle import JSON
  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string, reviveDates);
        // Cek struktur file (harus ada gudang)
        if (json.gudang && Array.isArray(json.gudang)) {
          const importedWarehouses = transformOldWarehouseData(json.gudang);
          setWarehouses(importedWarehouses);
          
          // Save to Firestore
          const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID;
          if (hasFirebaseConfig) {
            try {
              await saveWarehousesToFirestore(importedWarehouses);
              setIsFirebaseConnected(true);
            } catch (error) {
              console.error('Error saving imported data to Firestore:', error);
            }
          }
          
          alert('Data stok berhasil di-import!');
        } else {
          alert('File JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON!');
      }
    };
    reader.readAsText(file);
    // Reset input supaya bisa import file yang sama dua kali
    event.target.value = '';
  };

  const handleResetData = async () => {
    if (confirm('Apakah Anda yakin ingin mereset data ke nilai awal? Data yang tersimpan akan hilang.')) {
      setWarehouses(initialWarehouses);
      localStorage.removeItem('stokAppWarehouses');
      
      // Reset Firestore too
      const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      if (hasFirebaseConfig) {
        try {
          await saveWarehousesToFirestore(initialWarehouses);
          setIsFirebaseConnected(true);
        } catch (error) {
          console.error('Error resetting Firestore:', error);
        }
      }
      
      alert('Data berhasil direset ke nilai awal!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Factory className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sistem Manajemen Stok Minyak</h1>
                <p className="text-sm text-gray-400">Kontrol Stok Gudang Minyak Goreng</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('id-ID')}</span>
              </div>
              {import.meta.env.VITE_FIREBASE_PROJECT_ID && (
                <div className="flex items-center space-x-2 text-xs">
                  {isFirebaseConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 hidden sm:block">Real-time</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 hidden sm:block">Offline</span>
                    </>
                  )}
                </div>
              )}
              <ReportExporter 
                onExportPNG={exportPNGReport}
                onExportJSON={exportJSONReport}
              />
              {/* Tombol Import JSON */}
              <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImportJSON}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:block">Import JSON</span>
              </button>
              <button
                onClick={handleResetData}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:block">Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offline banner */}
      {import.meta.env.VITE_FIREBASE_PROJECT_ID && !isFirebaseConnected && !isLoading && (
        <div className="bg-yellow-500/10 text-yellow-300 border border-yellow-600/40 px-4 py-2 text-sm">
          Mode offline: perubahan disimpan ke localStorage dan akan disinkronkan saat koneksi kembali.
        </div>
      )}

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent mr-3" />
            <div className="text-amber-200 font-semibold">Memuat data...</div>
          </div>
        )}

        {/* Total Stock Summary */}
        <div className="mb-8">
          <TotalStockSummary totalStock={totalStock} totalCapacity={totalCapacity} />
        </div>

        {/* Warehouses Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Lokasi Gudang</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <RefreshCw className="w-4 h-4" />
              <span>Monitoring real-time</span>
            </div>
          </div>

          {warehouses.length === 0 && !isLoading ? (
            <div className="border border-gray-700/60 rounded-lg p-6 bg-gray-800/40 text-gray-300">
              Belum ada data gudang. Anda bisa import JSON atau reset ke data awal.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {warehouses.map(warehouse => (
                <WarehouseCard
                  key={warehouse.id}
                  warehouse={warehouse}
                  onTankUpdate={handleTankUpdate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">{warehouses.length}</div>
            <div className="text-sm text-gray-400">Gudang Aktif</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-green-400">{totalTanks}</div>
            <div className="text-sm text-gray-400">Total Tandon</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-amber-400">
              {totalStock.uco.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-400">Total UCO (kg)</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-orange-400">
              {totalStock.cpo.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-400">Total CPO (kg)</div>
          </div>
        </div>
      </main>

      {/* Tank Update Modal */}
      <TankUpdateModal
        warehouse={selectedWarehouse}
        tank={selectedTank}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateTankStock}
      />
    </div>
  );
}

export default App;