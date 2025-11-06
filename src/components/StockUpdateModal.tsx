import React, { useState } from 'react';
import { Warehouse, StockLevel } from '../types/warehouse';
import { X, Save, AlertTriangle } from 'lucide-react';
import { formatStockAmount } from '../utils/stockCalculations';

interface StockUpdateModalProps {
  warehouse: Warehouse | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (warehouseId: string, newStock: StockLevel) => void;
}

export const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  warehouse,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [ucoStock, setUcoStock] = useState(warehouse?.currentStock.uco || 0);
  const [cpoStock, setCpoStock] = useState(warehouse?.currentStock.cpo || 0);

  React.useEffect(() => {
    if (warehouse) {
      setUcoStock(warehouse.currentStock.uco);
      setCpoStock(warehouse.currentStock.cpo);
    }
  }, [warehouse]);

  if (!isOpen || !warehouse) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(warehouse.id, { uco: ucoStock, cpo: cpoStock });
    onClose();
  };

  const ucoExceeded = ucoStock > warehouse.capacity.uco;
  const cpoExceeded = cpoStock > warehouse.capacity.cpo;
  const hasErrors = ucoExceeded || cpoExceeded;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Update Stock - {warehouse.name}</h2>
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
                Used Cooking Oil (UCO)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={ucoStock}
                  onChange={(e) => setUcoStock(Number(e.target.value))}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                    ucoExceeded 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-amber-500'
                  }`}
                  min="0"
                  step="0.1"
                />
                <div className="mt-1 text-xs text-gray-400">
                  Capacity: {formatStockAmount(warehouse.capacity.uco)}
                </div>
                {ucoExceeded && (
                  <div className="flex items-center mt-1 text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Exceeds capacity by {formatStockAmount(ucoStock - warehouse.capacity.uco)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Crude Palm Oil (CPO)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={cpoStock}
                  onChange={(e) => setCpoStock(Number(e.target.value))}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                    cpoExceeded 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-amber-500'
                  }`}
                  min="0"
                  step="0.1"
                />
                <div className="mt-1 text-xs text-gray-400">
                  Capacity: {formatStockAmount(warehouse.capacity.cpo)}
                </div>
                {cpoExceeded && (
                  <div className="flex items-center mt-1 text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Exceeds capacity by {formatStockAmount(cpoStock - warehouse.capacity.cpo)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasErrors}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                hasErrors
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};