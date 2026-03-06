import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

const ExportMenu = ({ onExportCSV, onExportExcel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type) => {
    if (type === 'csv') {
      onExportCSV();
    } else if (type === 'excel') {
      onExportExcel();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
          <div className="py-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-3 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <div className="font-medium">Export as CSV</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Comma-separated values</div>
              </div>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <div className="font-medium">Export as Excel</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Microsoft Excel format</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
