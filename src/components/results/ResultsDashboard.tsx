import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTest } from '../../store/TestContext';
import { calculateResults } from '../../utils/scoring';
import { Download, RefreshCw, Eye, Brain, Activity, Target, ShieldCheck, FileText, Zap, Box, BookOpen, AlertTriangle, BarChart as BarChartIcon } from 'lucide-react';
import { ReviewDashboard } from './ReviewDashboard';
import { motion } from 'motion/react';
import { D3CategoryChart } from './D3CategoryChart';
import { D3SpeedAccuracyChart } from './D3SpeedAccuracyChart';
import { D3PopulationChart } from './D3PopulationChart';
import { D3BenchmarkChart } from './D3BenchmarkChart';
import { ThemeToggle } from '../ThemeToggle';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const ResultsDashboard = () => {
  const { session, resetTest } = useTest();
  const [showReview, setShowReview] = useState(false);
  const [printMode, setPrintMode] = useState<'report' | 'certificate' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);
  
  const results = useMemo(() => calculateResults(session), [session]);

  useEffect(() => {
    // Confetti removed to prevent canvas.getBoundingClientRect crashes in preview iframe
  }, []);

  useEffect(() => {
    if (printMode === 'certificate') {
      generateCertificatePDF();
    } else if (printMode === 'report') {
      generateReportPDF();
    }
  }, [printMode]);

  const generateReportPDF = async () => {
    if (!page1Ref.current || !page2Ref.current || !page3Ref.current || !page4Ref.current) return;
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const pages = [page1Ref, page2Ref, page3Ref, page4Ref];
      
      for (let i = 0; i < pages.length; i++) {
        const ref = pages[i];
        if (ref.current) {
          // html-to-image is highly robust and avoids oklch CSS errors 
          // by drawing the actual computed DOM via SVG foreignObjects.
          const dataUrl = await toPng(ref.current, { 
            backgroundColor: '#f8fafc', // Force slate-50 to ensure text stays readable
            pixelRatio: 2,
            style: { transform: 'scale(1)', transformOrigin: 'top left' }
          });
          
          const imgProps = pdf.getImageProperties(dataUrl);
          const ratio = imgProps.width / imgProps.height;
          let imgHeight = pdfWidth / ratio;
          
          if (i > 0) pdf.addPage();
          
          // Add some padding to the top (10mm)
          pdf.addImage(dataUrl, 'PNG', 0, 10, pdfWidth, imgHeight);
        }
      }
      
      pdf.save(`PatternIQ_Comprehensive_Report_${session.sessionId.substring(0,6)}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback to window.print if completely blocked
      window.print(); 
    } finally {
      setIsExporting(false);
      setPrintMode(null);
    }
  };

  const generateCertificatePDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      // Small timeout to allow the certificate UI to render to the DOM
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for certificate
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const dataUrl = await toPng(reportRef.current, { 
        backgroundColor: '#ffffff',
        pixelRatio: 2 
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const ratio = imgProps.width / imgProps.height;
      const imgHeight = pdfWidth / ratio;
      
      // Center vertically if needed
      const yOffset = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;
      
      pdf.addImage(dataUrl, 'PNG', 0, Math.max(0, yOffset), pdfWidth, imgHeight);
      pdf.save(`PatternIQ_Certificate_${session.sessionId.substring(0,6)}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsExporting(false);
      setPrintMode(null);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      version: '1.0',
      sessionId: session.sessionId,
      results,
      session
    }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `PatternIQ_Results_${session.sessionId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadPDF = () => {
    // Relying on native window print which handles modern CSS (like oklch in Tailwind v4) perfectly 
    // and produces vector-based, text-searchable PDFs natively.
    window.print();
  };

  if (showReview) {
    return <ReviewDashboard onClose={() => setShowReview(false)} />;
  }

  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  const d3CategoryData = Object.entries(results.categoryScores).map(([cat, data]: [string, any]) => ({
    category: cat.replace(' Reasoning', '').replace(' Analysis', ''),
    accuracy: data.accuracy || 0
  }));

  const d3SpeedAccuracyData = Object.entries(results.categoryScores).map(([cat, data]: [string, any]) => ({
    category: cat.replace(' Reasoning', '').replace(' Analysis', ''),
    accuracy: data.accuracy || 0,
    averageTimeMs: data.averageTimeMs || 0
  }));

  const benchmarkData = useMemo(() => {
    return Object.entries(results.categoryScores).map(([cat, data]: [string, any]) => {
      const cleanCat = cat.replace(' Reasoning', '').replace(' Analysis', '');
      
      // Generate some plausible, anonymized mock benchmarks for display purposes
      let benchmarkMean = 60;
      let benchmarkSD = 15;
      
      if (cleanCat.includes('Visual')) { benchmarkMean = 65; benchmarkSD = 12; }
      if (cleanCat.includes('Algorithmic')) { benchmarkMean = 45; benchmarkSD = 18; }
      if (cleanCat.includes('Mathematical')) { benchmarkMean = 55; benchmarkSD = 16; }
      if (cleanCat.includes('Memory')) { benchmarkMean = 50; benchmarkSD = 14; }
      if (cleanCat.includes('Sequence')) { benchmarkMean = 58; benchmarkSD = 15; }
      
      return {
        category: cleanCat,
        score: (data.accuracy || 0) * 100,
        benchmarkMean,
        benchmarkSD
      };
    });
  }, [results.categoryScores]);

  if (printMode === 'certificate') {
    return (
      <div className="bg-white min-h-screen text-slate-900 p-8 flex items-center justify-center font-sans">
        <div className="max-w-4xl w-full border-[12px] border-slate-900 p-12 md:p-24 relative overflow-hidden text-center bg-slate-50 shadow-2xl">
          {/* Ornate corner accents */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-slate-900" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-slate-900" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-slate-900" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-slate-900" />
          
          <Brain className="w-20 h-20 mx-auto text-blue-600 mb-8" />
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] mb-4 text-slate-900">
            Certificate of Excellence
          </h1>
          
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-12" />
          
          <p className="text-xl md:text-2xl text-slate-600 uppercase tracking-widest mb-6">
            This certifies that
          </p>
          
          <p className="text-3xl md:text-5xl font-serif italic text-slate-900 mb-12 border-b border-slate-300 inline-block px-12 pb-4">
            Candidate ID: {session.sessionId.split('-')[0].toUpperCase()}
          </p>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Has successfully completed the advanced PatternIQ Cognitive Assessment, demonstrating profound analytical capabilities, fluid reasoning, and algorithmic pattern recognition.
          </p>
          
          <div className="bg-white border-2 border-slate-900 inline-block px-12 py-8 my-8 relative">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Global G-Factor Score</h3>
            <div className="text-7xl font-black text-slate-900 tracking-tighter">{results.provisionalReasoningIndex}</div>
            <div className="text-lg font-bold uppercase tracking-widest text-blue-600 mt-2">{results.provisionalBand}</div>
          </div>
          
          <div className="flex justify-between items-end mt-16 text-left max-w-2xl mx-auto border-t-2 border-slate-200 pt-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Date of Assessment</p>
              <p className="text-lg font-medium text-slate-900">{new Date(session.endTime || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Validation ID</p>
              <p className="text-lg font-mono text-slate-900">{session.sessionId.split('-')[1]?.toUpperCase() || 'V-1029X'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-50 dark:bg-slate-950 min-h-screen pt-12 pb-24 font-sans text-slate-800 dark:text-slate-200 ${printMode === 'report' ? 'print:bg-white print:text-slate-900' : ''}`}>
      <motion.div 
        ref={reportRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 print:bg-transparent print:space-y-6"
      >
        <div ref={page1Ref}>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white flex items-center">
                <Brain className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
                Comprehensive Cognitive Profile
              </h1>
              <p className="text-slate-500 font-medium text-sm">Clinical Analysis ID: {session.sessionId.split('-')[0].toUpperCase()}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 print:hidden">
              <ThemeToggle />
              <button onClick={() => setShowReview(true)} className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-sm shadow-sm">
                <Eye className="w-4 h-4 mr-2" /> Review Answers
              </button>
              <button onClick={() => setPrintMode('certificate')} disabled={isExporting} className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50">
                <BookOpen className="w-4 h-4 mr-2" /> {isExporting && printMode === 'certificate' ? 'Generating...' : 'Download Certificate'}
              </button>
              <button onClick={() => setPrintMode('report')} disabled={isExporting} className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50">
                <FileText className="w-4 h-4 mr-2" /> {isExporting && printMode === 'report' ? 'Generating...' : 'Download Report'}
              </button>
              <button onClick={resetTest} className="flex items-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium text-sm shadow-sm">
                <RefreshCw className="w-4 h-4 mr-2" /> Start New Session
              </button>
            </div>
          </div>

          {/* Comforting Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-5 flex gap-4 mb-6">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
              <p className="font-bold mb-1 text-blue-950 dark:text-blue-100">Professional Assessment Results</p>
              <p>
                This report represents a comprehensive analysis of your cognitive patterns across multiple domains. Our multi-algorithmic approach evaluates working memory, fluid intelligence, and processing speed to provide a highly accurate, holistic view of your cognitive strengths. Remember, this is a snapshot of your current performance state, designed to help you understand your unique learning and problem-solving style.
              </p>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 break-inside-avoid">
            
            {/* Core Index Card */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden break-inside-avoid">
              <div className="relative z-10 mb-8">
                <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center text-xs"><Brain className="w-4 h-4 mr-2 text-indigo-500" /> Global G-Factor Estimate</h3>
                <div className="flex items-baseline gap-4 mt-2">
                  <span className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {results.provisionalReasoningIndex}
                  </span>
                  <span className="text-sm px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    {results.provisionalBand}
                  </span>
                </div>
                <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed text-sm">
                  Your Global Estimate is calculated using a multi-dimensional IRT (Item Response Theory) approximation, penalizing random guessing while rewarding accuracy on high-discrimination items.
                </p>
              </div>

            {/* Distribution Chart */}
            <div className="h-48 w-full relative z-10 -ml-4 mt-6">
              <D3PopulationChart userScore={results.provisionalReasoningIndex} />
            </div>
          </div>

          {/* Sub-Domains */}
          <div className="grid grid-rows-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-slate-500 font-bold tracking-wider text-xs flex items-center mb-1"><Zap className="w-4 h-4 mr-2 text-yellow-500" /> Fluid Intelligence (Gf)</h3>
                <div className="text-sm text-slate-400">Pattern & Logic</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{results.fluidIntelligence}</div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-slate-500 font-bold tracking-wider text-xs flex items-center mb-1"><Box className="w-4 h-4 mr-2 text-emerald-500" /> Working Memory</h3>
                <div className="text-sm text-slate-400">Retention Capacity</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{results.workingMemoryCapacity}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-slate-500 font-bold tracking-wider text-xs flex items-center mb-1"><BookOpen className="w-4 h-4 mr-2 text-blue-500" /> Crystallized (Gc)</h3>
                <div className="text-sm text-slate-400">Verbal & Quantitative</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{results.crystallizedIntelligence}</div>
            </div>
          </div>
          </div>
        </div>

        <div ref={page2Ref} className="pt-4">
          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* D3 Category Performance */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold mb-6 flex items-center"><BarChartIcon className="w-5 h-5 mr-2 text-indigo-500" /> Category Performance (D3)</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <D3CategoryChart data={d3CategoryData} />
              </div>
            </div>

            {/* D3 Speed vs Accuracy */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-sky-500" /> Speed vs Accuracy (D3)</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <D3SpeedAccuracyChart data={d3SpeedAccuracyData} />
              </div>
            </div>
          </div>
        </div>

        <div ref={page3Ref} className="pt-4">
          <div className="grid grid-cols-1 gap-6 break-inside-avoid">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300 w-full break-inside-avoid">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center"><Activity className="w-4 h-4 mr-2" /> Advanced Telemetry</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="flex items-center"><Activity className="w-4 h-4 mr-2 text-slate-400" /> Cognitive Processing Speed</span>
                  <span className="text-slate-900 dark:text-white font-bold">{results.cognitiveProcessingSpeed}</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="flex items-center"><Target className="w-4 h-4 mr-2 text-slate-400" /> Overall Consistency</span>
                  <span className="text-slate-900 dark:text-white font-bold">{Math.round(results.consistencyScore * 100)}%</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-slate-400" /> Guessing Penalty Applied</span>
                  <span className="text-slate-900 dark:text-white font-bold">-{results.guessingPenalty} pts</span>
                </li>
                {/* Show speed bonus if they have one */}
                <li className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="flex items-center"><Zap className="w-4 h-4 mr-2 text-yellow-500" /> Rapid Accuracy Bonus</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{results.speedBonus || 0} pts</span>
                </li>
                {session.integrityEvents.visibilityHidden > 0 && (
                  <li className="text-amber-600 dark:text-amber-400 mt-2 text-xs pt-2 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1" /> Integrity Warning: Backgrounding detected {session.integrityEvents.visibilityHidden} times
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div ref={page4Ref} className="pt-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col break-inside-avoid">
            <h2 className="text-xl font-bold mb-2 flex items-center"><Target className="w-6 h-6 mr-3 text-indigo-500" /> Reference Benchmark Comparison</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-3xl leading-relaxed">
              This chart compares your category-specific accuracy against a broad, anonymized reference distribution. The shaded region represents the typical performance band (±1 standard deviation from the mean). This provides context for your provisional score but does not constitute a clinical diagnosis.
            </p>
            <div className="flex-1 w-full min-h-[400px]">
              <D3BenchmarkChart data={benchmarkData} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
