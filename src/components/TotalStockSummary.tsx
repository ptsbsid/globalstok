import React from 'react';
import { StockLevel } from '../types/warehouse';
import { formatStockAmount } from '../utils/stockCalculations';
import { BarChart3, TrendingUp, Droplets } from 'lucide-react';

interface TotalStockSummaryProps {
  totalStock: StockLevel;
  totalCapacity: StockLevel;
}

export const TotalStockSummary: React.FC<TotalStockSummaryProps> = ({ 
  totalStock, 
  totalCapacity 
}) => {
  const safePct = (current: number, cap: number) => {
    if (!cap || cap <= 0) return 0;
    const pct = (current / cap) * 100;
    if (!Number.isFinite(pct)) return 0;
    return Math.round(Math.max(0, Math.min(100, pct)));
  };

  const ucoPercentage = safePct(totalStock.uco, totalCapacity.uco);
  const cpoPercentage = safePct(totalStock.cpo, totalCapacity.cpo);
  const totalKg = totalStock.uco + totalStock.cpo;
  const totalCapacityKg = totalCapacity.uco + totalCapacity.cpo;
  const overallPercentage = safePct(totalKg, totalCapacityKg);

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-500/30 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-amber-500/30 rounded-lg">
          <BarChart3 className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Ringkasan Total Stok</h2>
          <p className="text-amber-200 text-sm">Gabungan dari semua gudang</p>
        </div>
        <div className="ml-auto flex items-center space-x-2 text-amber-400">
          <TrendingUp className="w-5 h-5" />
          <span className="text-2xl font-bold">{overallPercentage}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Used Cooking Oil</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatStockAmount(totalStock.uco)}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${ucoPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Crude Palm Oil</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatStockAmount(totalStock.cpo)}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-700"
              style={{ width: `${cpoPercentage}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};