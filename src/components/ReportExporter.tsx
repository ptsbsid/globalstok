import React from 'react';
import html2canvas from 'html2canvas';
import { Download, FileImage } from 'lucide-react';

interface ReportExporterProps {
  onExportPNG: () => void;
  onExportJSON: () => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ onExportPNG, onExportJSON }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onExportPNG}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
      >
        <FileImage className="w-4 h-4" />
        <span className="hidden sm:block">Export PNG</span>
      </button>
      <button
        onClick={onExportJSON}
        className="flex items-center space-x-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:block">Export JSON</span>
      </button>
    </div>
  );
};

export const exportToPNG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PNG export');
    return;
  }

  try {
    // Only capture the visible viewport
    const canvas = await html2canvas(element, {
      backgroundColor: '#111827',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      windowWidth: element.scrollWidth, // Capture current width
      windowHeight: element.scrollHeight, // Capture current height (viewport)
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
  }
};