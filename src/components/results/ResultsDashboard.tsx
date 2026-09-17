import React, { useMemo, useState, useRef } from 'react';
import { useTest } from '../../store/TestContext';
import { calculateResults } from '../../utils/scoring';
import { BarChart as BarChartIcon, Download, RefreshCw, Eye, Brain, Activity, Target, ShieldCheck, FileText, Zap, Box, BookOpen, AlertTriangle } from 'lucide-react';
import { ReviewDashboard } from './ReviewDashboard';
import { motion } from 'motion/react';
import { D3CategoryChart } from './D3CategoryChart';
import { D3SpeedAccuracyChart } from './D3SpeedAccuracyChart';
import { D3PopulationChart } from './D3PopulationChart';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  BarChart, Bar, Cell
} from 'recharts';

// Helper to generate a normal distribution curve
const generateNormalDistribution = (mean: number, stdDev: number) => {
  const data = [];
  for (let i = 55; i <= 145; i += 2) {
    const exponent = Math.exp(-Math.pow(i - mean, 2) / (2 * Math.pow(stdDev, 2)));
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
    data.push({ x: i, y: y * 1000 }); // scale up for visualization
  }
  return data;
};

export const ResultsDashboard = () => {
  const { session, resetTest } = useTest();
  const [showReview, setShowReview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const results = useMemo(() => calculateResults(session), [session]);

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

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Cognitive_Profile_${session.sessionId.substring(0, 6)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (showReview) {
    return <ReviewDashboard onClose={() => setShowReview(false)} />;
  }

  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  // Prepare radar chart data
  const radarData = Object.entries(results.categoryScores).map(([cat, data]: [string, any]) => ({
    subject: cat.replace(' Reasoning', '').replace(' Analysis', ''),
    A: Math.round(data.accuracy * 100),
    fullMark: 100,
  }));

  // Prepare difficulty bar chart data
  const diffData = [1, 2, 3, 4, 5].map(diff => {
    const d = results.difficultyScores[diff as keyof typeof results.difficultyScores];
    return {
      name: `Lvl ${diff}`,
      accuracy: Math.round((d as any).accuracy * 100),
      raw: d
    };
  });

  const d3CategoryData = Object.entries(results.categoryScores).map(([cat, data]: [string, any]) => ({
    category: cat.replace(' Reasoning', '').replace(' Analysis', ''),
    accuracy: data.accuracy
  }));

  const d3SpeedAccuracyData = Object.entries(results.categoryScores).map(([cat, data]: [string, any]) => ({
    category: cat.replace(' Reasoning', '').replace(' Analysis', ''),
    accuracy: data.accuracy,
    averageTimeMs: data.averageTimeMs || 0
  }));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-12 pb-24 font-sans text-slate-800 dark:text-slate-200">
      <motion.div 
        ref={reportRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white flex items-center">
              <Brain className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
              Comprehensive Cognitive Profile
            </h1>
            <p className="text-slate-500 font-medium text-sm">Clinical Analysis ID: {session.sessionId.split('-')[0].toUpperCase()}</p>
          </div>
          <div className="flex flex-wrap gap-3" data-html2canvas-ignore>
            <button onClick={() => setShowReview(true)} className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-sm shadow-sm">
              <Eye className="w-4 h-4 mr-2" /> Review Answers
            </button>
            <button onClick={handleDownloadPDF} disabled={isExporting} className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors font-medium text-sm shadow-sm">
              <FileText className="w-4 h-4 mr-2" /> {isExporting ? 'Generating...' : 'Download PDF Report'}
            </button>
            <button onClick={resetTest} className="flex items-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium text-sm shadow-sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Start New Session
            </button>
          </div>
        </div>

        {/* Comforting Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-5 flex gap-4">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
          <div className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
            <p className="font-bold mb-1 text-blue-950 dark:text-blue-100">Professional Assessment Results</p>
            <p>
              This report represents a comprehensive analysis of your cognitive patterns across multiple domains. Our multi-algorithmic approach evaluates working memory, fluid intelligence, and processing speed to provide a highly accurate, holistic view of your cognitive strengths. Remember, this is a snapshot of your current performance state, designed to help you understand your unique learning and problem-solving style.
            </p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Core Index Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center"><BarChartIcon className="w-5 h-5 mr-2 text-indigo-500" /> Cognitive Dimensionality</h3>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Accuracy" dataKey="A" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Accuracy']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Chart & Meta */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
            <h3 className="text-lg font-bold mb-6">Difficulty Scaling Profile</h3>
            <div className="h-48 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diffData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value}%`, 'Accuracy']}
                  />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {diffData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#3b82f6' : entry.accuracy > 40 ? '#818cf8' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300">
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
              {session.integrityEvents.visibilityHidden > 0 && (
                <li className="text-amber-600 dark:text-amber-400 mt-2 text-xs pt-2 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Integrity Warning: Backgrounding detected {session.integrityEvents.visibilityHidden} times
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
      </motion.div>
    </div>
  );
};
