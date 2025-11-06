import React from 'react';
import { Tank } from '../types/warehouse';
import { 
  calculateStockPercentage, 
  formatStockAmount, 
  getStockLevelColor,
  getStockLevelBgColor 
} from '../utils/stockCalculations';
import { Droplets, Edit3 } from 'lucide-react';
import { MiniTankIndicator } from './MiniTankIndicator';

interface TankCardProps {
  tank: Tank;
  onUpdate: (tank: Tank) => void;
}

export const TankCard: React.FC<TankCardProps> = ({ tank, onUpdate }) => {
  const percentage = calculateStockPercentage(tank.currentStock, tank.capacity);
  let label = '';
  let color = '';

  if (tank.oilType === 'UCO') {
    label = 'UCO';
    color = 'bg-blue-500';
  } else if (tank.oilType === 'CPO') {
    label = 'CPO';
    color = 'bg-green-500';
  } else {
    label = 'Empty';
    color = 'bg-gray-500';
  }

  return (
    <div className="bg-gray-800/60 rounded-lg p-3 md:p-4 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-500/20 rounded-md">
            <Droplets className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-sm md:text-base font-bold text-white">{tank.name}</h4>
        </div>
        <button
          onClick={() => onUpdate(tank)}
          className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 rounded-md transition-colors duration-200 group"
        >
          <Edit3 className="w-3 h-3 text-amber-400 group-hover:text-amber-300" />
        </button>
      </div>

      <div className="space-y-3">
        <MiniTankIndicator 
          percentage={percentage}
          label={label}
          current={tank.currentStock}
          capacity={tank.capacity}
          color={color}
        />
      </div>
    </div>
  );
};