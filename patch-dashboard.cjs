const fs = require('fs');
let code = fs.readFileSync('src/components/results/ResultsDashboard.tsx', 'utf8');

// Add state for viewMode
code = code.replace(
  "  const [isExporting, setIsExporting] = useState(false);",
  "  const [isExporting, setIsExporting] = useState(false);\n  const [viewMode, setViewMode] = useState<'dashboard' | 'report'>('dashboard');"
);

// Add "View Report Document" button
code = code.replace(
  "              <button onClick={() => setPrintMode('report')} disabled={isExporting} className=\"flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50\">\n                <FileText className=\"w-4 h-4 mr-2\" /> {isExporting && printMode === 'report' ? 'Generating...' : 'Download Report'}\n              </button>",
  `              <button onClick={() => setViewMode('report')} disabled={isExporting} className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50">
                <FileText className="w-4 h-4 mr-2" /> View Report
              </button>
              <button onClick={() => setPrintMode('report')} disabled={isExporting} className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50">
                <Download className="w-4 h-4 mr-2" /> {isExporting && printMode === 'report' ? 'Generating...' : 'Download PDF'}
              </button>`
);

// Add the viewMode rendering logic
code = code.replace(
  "  return (\n    <div className={`bg-slate-50 dark:bg-slate-950 min-h-screen pt-12 pb-24 font-sans text-slate-800 dark:text-slate-200 ${printMode === 'report' ? 'print:bg-white print:text-slate-900' : ''}`}>",
  `  if (viewMode === 'report') {
    return (
      <div className="bg-slate-200 dark:bg-slate-900 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 mb-8 flex justify-between items-center no-print">
          <button 
            onClick={() => setViewMode('dashboard')}
            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Print / Save PDF
          </button>
        </div>
        <PDFReportTemplate results={results} session={session} isViewMode={true} />
      </div>
    );
  }

  return (
    <div className={\`bg-slate-50 dark:bg-slate-950 min-h-screen pt-12 pb-24 font-sans text-slate-800 dark:text-slate-200 \${printMode === 'report' ? 'print:bg-white print:text-slate-900' : ''}\`}>`
);

fs.writeFileSync('src/components/results/ResultsDashboard.tsx', code);
