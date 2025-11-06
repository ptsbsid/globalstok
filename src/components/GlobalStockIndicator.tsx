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
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <div className="text-lg font-bold text-white">
        {formatStockAmount(current)}
      </div>
    </div>
  ); 