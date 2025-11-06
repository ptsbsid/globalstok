import React from 'react';
import { formatStockAmount } from '../utils/stockCalculations';

interface MiniTankIndicatorProps {
  percentage: number;
  label: string;
  current: number;
  capacity: number;
  color: string;
}

export const MiniTankIndicator: React.FC<MiniTankIndicatorProps> = ({
  percentage, label, current, capacity, color
}) => {

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>
          {percentage}%
        </span>
      </div>
      <div className="w-full h-16 bg-gray-700 rounded-md relative overflow-hidden border border-gray-600">
        {/* Tank background */}
        <div 
          className={`absolute bottom-0 left-0 w-full rounded-b-md transition-all duration-500 ease-out ${color}`}
          style={{ height: `${percentage}%` }}
        />
        {/* Fill level line */}
        <div 
          className="absolute bottom-0 left-0 w-full border-t border-gray-400 opacity-70"
          style={{ bottom: `${percentage}%` }}
        />
        {/* Current stock amount inside the tank */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold z-10 bg-black bg-opacity-30 rounded"
        >
          Terisi: {formatStockAmount(current)}
        </div>
      </div>
      <div className="flex justify-end text-xs text-gray-400 mt-1">
        <span>Max: {formatStockAmount(capacity)}</span>
      </div>
    </div>
  );
}; 