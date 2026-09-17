import React, { useMemo, useState } from 'react';
import { useTest } from '../../store/TestContext';
import { calculateResults } from '../../utils/scoring';
import { BarChart as BarChartIcon, AlertTriangle, Download, RefreshCw, Eye, Brain, Activity, Target } from 'lucide-react';
import { ReviewDashboard } from './ReviewDashboard';
import { motion } from 'motion/react';
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
  
  const results = useMemo(() => calculateResults(session), [session]);
  const distributionData = useMemo(() => generateNormalDistribution(100, 15), []);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-8 pt-12 pb-24 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">PatternIQ Analytics</h1>
          <p className="text-slate-500 font-mono text-sm uppercase tracking-wider">Session Ref: {session.sessionId.split('-')[0]}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowReview(true)} className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium">
            <Eye className="w-4 h-4 mr-2" /> Review Answers
          </button>
          <button onClick={handleExport} className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium">
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </button>
          <button onClick={resetTest} className="flex items-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-bold">
            <RefreshCw className="w-4 h-4 mr-2" /> New Assessment
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-5 flex gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0" />
        <div className="text-sm text-amber-800 dark:text-amber-400">
          <p className="font-bold mb-1">Important Scientific Disclaimer</p>
          <p>
            The scores and distribution curves presented below are an <strong>experimental algorithmic interpretation</strong> of performance on this specific assessment. They are <strong>not</strong> derived from a clinically validated population norm. Do not treat these results as a medical or official IQ measurement.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Index Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Brain className="w-48 h-48" />
          </div>
          <div className="relative z-10 mb-8">
            <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center"><Brain className="w-4 h-4 mr-2" /> Provisional Reasoning Index</h3>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white tracking-tighter">
                {results.provisionalReasoningIndex}
              </span>
              <span className="text-xl px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full font-bold uppercase tracking-widest">
                {results.provisionalBand}
              </span>
            </div>
            <p className="mt-4 text-slate-500 max-w-md leading-relaxed">
              Based on your accuracy, speed, and difficulty scaling, this algorithmic estimate places your performance in the {results.provisionalBand.toLowerCase()} range.
            </p>
          </div>

          {/* Distribution Chart */}
          <div className="h-48 w-full relative z-10 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distributionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="x" type="number" domain={[55, 145]} ticks={[70, 85, 100, 115, 130]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={() => null} />
                <Area type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorY)" />
                <ReferenceLine x={results.provisionalReasoningIndex} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" label={{ position: 'top', value: 'You', fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supporting Metrics */}
        <div className="grid grid-rows-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center"><Target className="w-4 h-4 mr-2" /> Raw Accuracy</h3>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{Math.round(results.accuracy * 100)}%</div>
            <div className="text-sm text-slate-500">
              {results.rawScore} / {results.totalQuestions} Questions Correct
            </div>
            <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${results.accuracy * 100}%` }} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center"><Activity className="w-4 h-4 mr-2" /> Performance Consistency</h3>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{Math.round(results.consistencyScore * 100)}%</div>
            <div className="text-sm text-slate-500">
              Variance across difficulty tiers
            </div>
            <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${results.consistencyScore * 100}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Analytics */}
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

          <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm text-slate-300">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center"><Activity className="w-4 h-4 mr-2" /> Behavioral Telemetry</h3>
            <ul className="space-y-3 text-sm font-mono">
              <li className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span>Median Time / Question</span>
                <span className="text-white font-bold">{formatTime(results.medianTimePerQuestionMs)}</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span>Answer Revisions</span>
                <span className="text-white font-bold">{results.answerRevisionCount}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Skipped Items</span>
                <span className="text-white font-bold">{results.skippedCount}</span>
              </li>
              {session.integrityEvents.visibilityHidden > 0 && (
                <li className="text-amber-500 mt-2 text-xs pt-2">
                  ⚠ Backgrounding detected {session.integrityEvents.visibilityHidden} times
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
