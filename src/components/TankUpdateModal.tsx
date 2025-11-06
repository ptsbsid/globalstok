import React, { useState } from 'react';
import { Warehouse, Tank } from '../types/warehouse';
import { X, Save, AlertTriangle } from 'lucide-react';
import { formatStockAmount } from '../utils/stockCalculations';

interface TankUpdateModalProps {
  warehouse: Warehouse | null;
  tank: Tank | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (warehouseId: string, tankId: string, newStock: number, newOilType: 'UCO' | 'CPO' | 'Empty') => void;
}

export const TankUpdateModal: React.FC<TankUpdateModalProps> = ({
  warehouse,
  tank,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [currentStock, setCurrentStock] = useState(tank?.currentStock || 0);
  const [oilType, setOilType] = useState<'UCO' | 'CPO' | 'Empty'>(tank?.oilType || 'Empty');

  React.useEffect(() => {
    if (tank) {
      setCurrentStock(tank.currentStock);
      setOilType(tank.oilType);
    }
  }, [tank]);

  if (!isOpen || !warehouse || !tank) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(warehouse.id, tank.id, currentStock, oilType);
    onClose();
  };

  const stockExceeded = currentStock > tank.capacity;
  const hasErrors = stockExceeded;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Perbarui Stok Tandon</h2>
            <p className="text-sm text-gray-400">{warehouse.name} - {tank.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Jenis Minyak
              </label>
              <select
                value={oilType}
                onChange={(e) => setOilType(e.target.value as 'UCO' | 'CPO' | 'Empty')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              >
                <option value="Empty">-- Kosong --</option>
                <option value="UCO">Used Cooking Oil (UCO)</option>
                <option value="CPO">Crude Palm Oil (CPO)</option>
              </select>
            </div>

            {oilType !== 'Empty' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stok ({oilType})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                      stockExceeded 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:ring-amber-500'
                    }`}
                    min="0"
                    step="0.1"
                  />
                  <div className="mt-1 text-xs text-gray-400">
                    Kapasitas: {formatStockAmount(tank.capacity)}
                  </div>
                  {stockExceeded && (
                    <div className="flex items-center mt-1 text-xs text-red-400">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Melebihi kapasitas sebesar {formatStockAmount(currentStock - tank.capacity)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={hasErrors || (oilType !== 'Empty' && currentStock === 0)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                hasErrors || (oilType !== 'Empty' && currentStock === 0)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              Perbarui Stok
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};