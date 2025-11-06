import React from 'react';
import { formatStockAmount } from '../utils/stockCalculations';

interface GlobalStockIndicatorProps {
  label: string;
  current: number;
  color: string;
}

export const GlobalStockIndicator: React.FC<GlobalStockIndicatorProps> = 
  ({ label, current, color }) => (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center space-x-2">
        <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${color}`} />
        <span className="text-xs md:text-sm font-medium text-gray-300">{label}</span>
      </div>
      <div className="text-base md:text-lg font-bold text-white">
        {formatStockAmount(current)}
      </div>
    </div>
  ); 