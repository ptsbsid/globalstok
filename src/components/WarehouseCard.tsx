import React, { useState } from 'react';
import { Warehouse } from '../types/warehouse';
import { 
  calculateStockPercentage,
  getStockLevelColor
} from '../utils/stockCalculations';
import { TankCard } from './TankCard';
import { GlobalStockIndicator } from './GlobalStockIndicator';
import { Warehouse as WarehouseIcon, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface WarehouseCardProps {
  warehouse: Warehouse;
  onTankUpdate: (warehouse: Warehouse, tankId: string) => void;
}

export const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse, onTankUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const ucoPercentage = calculateStockPercentage(warehouse.totalCurrentStock.uco, warehouse.totalCapacity.uco);
  const cpoPercentage = calculateStockPercentage(warehouse.totalCurrentStock.cpo, warehouse.totalCapacity.cpo);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-amber-500/50">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <WarehouseIcon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">{warehouse.name}</h3>
              <div className="text-[11px] md:text-xs text-amber-400 mt-1">
                {warehouse.tanks.length} Tandon
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors duration-200 group"
            data-expand-button
            data-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-amber-400 group-hover:text-amber-300" />
            ) : (
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-amber-400 group-hover:text-amber-300" />
            )}
          </button>
        </div>

        <div className="space-y-2 border-t border-b border-gray-700 py-3 md:py-4 my-3 md:my-4">
          {warehouse.totalCapacity.uco > 0 && (
            <GlobalStockIndicator 
              label="Total Used Cooking Oil (UCO)"
              current={warehouse.totalCurrentStock.uco}
              color={getStockLevelColor(ucoPercentage)}
            />
          )}
          {warehouse.totalCapacity.cpo > 0 && (
            <GlobalStockIndicator 
              label="Total Crude Palm Oil (CPO)"
              current={warehouse.totalCurrentStock.cpo}
              color={getStockLevelColor(cpoPercentage)}
            />
          )}
        </div>

        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-700 flex items-center text-[11px] md:text-xs text-gray-400">
          <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          Terakhir diperbarui: {warehouse.lastUpdated.toLocaleDateString('id-ID')} pukul {warehouse.lastUpdated.toLocaleTimeString('id-ID')}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="border-t border-gray-700 pt-3 md:pt-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Detail Tandon:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {warehouse.tanks.map(tank => (
                <TankCard
                  key={tank.id}
                  tank={tank}
                  onUpdate={() => onTankUpdate(warehouse, tank.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};