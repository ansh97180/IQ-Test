const fs = require('fs');

const code = `import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTest } from '../../store/TestContext';
import { calculateResults } from '../../utils/scoring';
import { Download, RefreshCw, Eye, Brain, Activity, Target, ShieldCheck, FileText, Zap, Box, BookOpen, AlertTriangle, BarChart as BarChartIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { ReviewDashboard } from './ReviewDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { D3PopulationChart } from './D3PopulationChart';
import { ThemeToggle } from '../ThemeToggle';
import { PDFReportTemplate } from './PDFReportTemplate';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { getPerformanceInsight } from '../../utils/performanceInsights';

const DomainExplanation = ({ domain, score, expanded, onToggle }: { domain: any, score: number | null, expanded: boolean, onToggle: () => void }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{domain.name}</div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {score !== null ? score : <span className="text-sm font-normal text-slate-400">Not Evaluated</span>}
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 dark:border-slate-800"
          >
            <div className="p-6 space-y-6 text-sm text-slate-600 dark:text-slate-400">
              
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-2">What it Measures</h4>
                <p>{domain.measures}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-2">How You Performed</h4>
                <p>{getPerformanceInsight(domain.name, score)}</p>
                <p className="mt-2 text-indigo-600 dark:text-indigo-400 font-medium">
                  {score !== null && score >= 115 
                    ? \`Your \${domain.name.split(' (')[0].toLowerCase()} performance was particularly strong relative to your other measured domains.\`
                    : score !== null && score <= 85
                    ? \`Your performance on \${domain.name.split(' (')[0].toLowerCase()} items was lower than your performance in some other areas.\`
                    : score !== null 
                    ? \`Your performance on \${domain.name.split(' (')[0].toLowerCase()} items was generally balanced with your overall cognitive profile.\`
                    : ''}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-2">What Types of Tasks Were Included</h4>
                <p>{domain.tasks}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-2">What the Score Represents</h4>
                <p>{domain.represents}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50">
                <h4 className="font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider text-xs mb-1">Limitations</h4>
                <p className="text-amber-800 dark:text-amber-300/80">{domain.limitations}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ResultsDashboard = () => {
  const { session, resetTest } = useTest();
  const [showReview, setShowReview] = useState(false);
  const [printMode, setPrintMode] = useState<'report' | 'certificate' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'report'>('dashboard');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  
  const results = useMemo(() => calculateResults(session), [session]);

  useEffect(() => {
    if (printMode === 'certificate') {
      //
    } else if (printMode === 'report') {
      generateReportPDF();
    }
  }, [printMode]);

  const generateReportPDF = async () => {
    if (!pdfTemplateRef.current) return;
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const pages = pdfTemplateRef.current.querySelectorAll('.pdf-page');
      
      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;
        const dataUrl = await toPng(pageEl, { 
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          style: { transform: 'scale(1)', transformOrigin: 'top left' },
          cacheBust: true,
        });
        
        const imgProps = pdf.getImageProperties(dataUrl);
        const ratio = imgProps.width / imgProps.height;
        const imgHeight = pdfWidth / ratio;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
      }
      
      pdf.save(\`PatternIQ_Comprehensive_Report_\${session.sessionId.substring(0,6)}.pdf\`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print(); 
    } finally {
      setIsExporting(false);
      setPrintMode(null);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return \`\${minutes}m \${seconds}s\`;
  };

  if (showReview) {
    return <ReviewDashboard onClose={() => setShowReview(false)} />;
  }

  const domainData = [
    { 
      name: "Fluid Reasoning (GF)", 
      score: results.fluidIntelligence,
      measures: "The ability to solve novel problems, identify patterns, and extrapolate logical rules without relying heavily on prior knowledge.",
      tasks: "Number sequences, visual pattern matrices, and abstract logic puzzles.",
      represents: "A proxy for adaptability and raw problem-solving speed in entirely unfamiliar scenarios.",
      limitations: "Scores can be heavily influenced by test anxiety, unfamiliarity with the digital testing format, and fatigue."
    },
    { 
      name: "Crystallized Knowledge (GC)", 
      score: results.crystallizedIntelligence,
      measures: "The depth and breadth of acquired knowledge, vocabulary, and learned methodologies.",
      tasks: "Mathematical formulas, applied logic deductions, and structured algorithmic problems.",
      represents: "How effectively you store and retrieve structured learning from past experiences and education.",
      limitations: "Heavily dependent on cultural context, language proficiency, and educational background."
    },
    { 
      name: "Working Memory (GWM)", 
      score: results.workingMemoryCapacity,
      measures: "The capacity to temporarily hold, manipulate, and process multiple pieces of information simultaneously.",
      tasks: "Multi-step mental arithmetic, complex sequence reversals, and multi-variable spatial tracking.",
      represents: "The size of your 'mental scratchpad', crucial for complex comprehension and learning.",
      limitations: "Highly sensitive to distractions, lack of sleep, and cognitive load limits."
    },
    { 
      name: "Processing Speed (Gs)", 
      score: results.cognitiveProcessingSpeed,
      measures: "The speed and efficiency of executing simple or repetitive cognitive tasks fluently and automatically.",
      tasks: "Timed discrimination tasks, rapid symbol matching, and visual scanning.",
      represents: "Mental quickness and the ability to maintain focus under time pressure.",
      limitations: "May penalize individuals who naturally adopt a slower, more meticulous verification strategy."
    },
    { 
      name: "Visual-Spatial Processing (Gv)", 
      score: results.categoryScores['Spatial Reasoning']?.accuracy ? Math.round(70 + results.categoryScores['Spatial Reasoning'].accuracy * 70) : null,
      measures: "The ability to perceive, analyze, synthesize, and mentally manipulate visual patterns.",
      tasks: "Mental rotation of 3D objects, spatial folding, and visual sequence extrapolation.",
      represents: "Aptitude for navigating and interpreting the physical and visual world.",
      limitations: "Screen glare, display size, and visual fatigue can artificially lower performance."
    },
    { 
      name: "Auditory Processing (Ga)", 
      score: null,
      measures: "The ability to analyze, synthesize, and discriminate auditory stimuli.",
      tasks: "Phonetic discrimination, tonal memory, and rhythm tracking.",
      represents: "How well the brain processes and interprets sound-based information.",
      limitations: "Not evaluated in this visual-only assessment version."
    },
    { 
      name: "Long-Term Retrieval (Glr)", 
      score: null,
      measures: "The ability to store information fluently and retrieve it later over extended periods.",
      tasks: "Paired-associate learning, delayed recall, and semantic fluency.",
      represents: "Efficiency in transferring information into permanent memory and retrieving it.",
      limitations: "Not evaluated in this short-duration assessment version."
    },
    { 
      name: "Quantitative Knowledge (Gq)", 
      score: results.categoryScores['Mathematical Logic']?.accuracy ? Math.round(70 + results.categoryScores['Mathematical Logic'].accuracy * 70) : null,
      measures: "The breadth of mathematical knowledge and the ability to apply it.",
      tasks: "Algebraic problem solving, probability calculations, and numerical logic.",
      represents: "Acquired facility with numbers and mathematical operations.",
      limitations: "Requires formal mathematical education to score highly."
    },
    { 
      name: "Reading & Writing (Grw)", 
      score: null,
      measures: "The acquisition and application of basic reading and writing skills.",
      tasks: "Reading comprehension, spelling, and grammar usage.",
      represents: "Literacy and language proficiency.",
      limitations: "Not evaluated in this reasoning-focused assessment version."
    }
  ];

  if (viewMode === 'report') {
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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-12 pb-24 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Assessment Results</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Session ID: {session.sessionId.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ThemeToggle />
            <button onClick={() => setViewMode('report')} disabled={isExporting} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50">
              <FileText className="w-4 h-4 mr-2" /> View Report
            </button>
            <button onClick={() => setPrintMode('report')} disabled={isExporting} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50">
              <Download className="w-4 h-4 mr-2" /> {isExporting && printMode === 'report' ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* 1. YOUR RESULTS */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wider text-sm border-b border-slate-200 dark:border-slate-800 pb-2">Your Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="w-24 h-24 text-indigo-600" />
              </div>
              <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-2 text-xs">Overall Assessment</h3>
              <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{results.provisionalReasoningIndex}</div>
              <div><span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-bold tracking-wider uppercase">{results.provisionalBand}</span></div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-2 text-xs">Accuracy</h3>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{(results.accuracy * 100).toFixed(1)}%</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center gap-4">
              <div>
                <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-1 text-xs">Questions Completed</h3>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{results.rawScore} / {results.totalQuestions}</div>
              </div>
              <div>
                <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-1 text-xs">Time</h3>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(results.totalTimeMs)}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
             <button onClick={() => setShowReview(true)} className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
               <Eye className="w-4 h-4 mr-1" /> Review Answer History
             </button>
          </div>
        </div>

        {/* 2. COGNITIVE PROFILE */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wider text-sm border-b border-slate-200 dark:border-slate-800 pb-2">Cognitive Profile</h2>
          <div className="space-y-4">
            {domainData.map((domain) => (
              <DomainExplanation 
                key={domain.name} 
                domain={domain} 
                score={domain.score}
                expanded={expandedDomain === domain.name}
                onToggle={() => setExpandedDomain(expandedDomain === domain.name ? null : domain.name)}
              />
            ))}
          </div>
        </div>

        {/* 3. BENCHMARK SECTION - LAST */}
        <div className="mt-16 pt-16 border-t-4 border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wider text-sm border-b border-slate-200 dark:border-slate-800 pb-2">Benchmark / Reference Comparison</h2>
          
          <div className="bg-slate-100 dark:bg-slate-800/40 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="col-span-1">
                <div className="mb-6">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Your Assessment Score</p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">{results.provisionalReasoningIndex}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Reference Mean</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">100</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Reference SD</p>
                  <p className="text-xl font-bold text-slate-600 dark:text-slate-400">15</p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
                <div className="w-full relative py-8">
                  {/* Visual Scale */}
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 px-2 uppercase tracking-wider">
                    <span>Lower</span>
                    <span>Average Reference</span>
                    <span>Higher</span>
                  </div>
                  
                  <div className="relative h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-full overflow-hidden shadow-inner">
                    {/* Average Band shaded region (85 to 115) */}
                    <div className="absolute left-[33%] right-[33%] top-0 bottom-0 bg-slate-300/50 dark:bg-slate-600/50"></div>
                    
                    {/* Center Line (100) */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-slate-400 dark:bg-slate-500"></div>
                    
                    {/* User Score Marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-3 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-1000"
                      style={{ left: \`\${Math.max(5, Math.min(95, ((results.provisionalReasoningIndex - 55) / (145 - 55)) * 100))}%\` }}
                    ></div>
                  </div>
                  
                  <div className="text-center mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Relative position: 
                    <strong className="text-indigo-600 dark:text-indigo-400 ml-2">
                      {results.provisionalReasoningIndex >= 115 ? 'Above reference mean' 
                       : results.provisionalReasoningIndex <= 85 ? 'Below reference mean' 
                       : 'Near reference mean'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
              <p>
                <strong>Limitations:</strong> This benchmark comparison uses an anonymized reference distribution. It is intended for context and personal insight only. 
              </p>
              <p>
                <strong>Reliability:</strong> Do not consider this a clinically validated IQ score. True intelligence testing requires controlled environmental administration and exhaustive population norming. Score precision may vary based on test fatigue and environmental distractions.
              </p>
            </div>
          </div>
        </div>

        <PDFReportTemplate ref={pdfTemplateRef} results={results} session={session} />
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/results/ResultsDashboard.tsx', code);
