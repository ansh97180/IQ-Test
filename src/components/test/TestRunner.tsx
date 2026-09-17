import React, { useEffect, useState, useRef } from 'react';
import { useTest } from '../../store/TestContext';
import { questions } from '../../data/questions';
import { VisualArea } from './VisualArea';
import { Flag, Clock, ChevronLeft, ChevronRight, Check, Settings, X, Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TestRunner = () => {
  const { session, answerQuestion, goToQuestion, toggleFlag, updateTime, endTest, recordIntegrityEvent, getTimeRemaining, updateSettings } = useTest();
  
  const [showSettings, setShowSettings] = useState(false);
  const qId = session.questionOrder[session.currentIndex];
  const question = questions.find(q => q.id === qId)!;
  const answerRecord = session.answers[qId] || { selectedAnswer: null };
  
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const timerRef = useRef<NodeJS.Timeout>();
  const [qTimeSpent, setQTimeSpent] = useState(answerRecord.timeSpent || 0);

  useEffect(() => {
    setQTimeSpent(session.answers[qId]?.timeSpent || 0);
  }, [qId, session.answers]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeLeft(remaining);
      updateTime(1000);
      setQTimeSpent(prev => prev + 1000);
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        endTest();
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [updateTime, getTimeRemaining, endTest]);

  useEffect(() => {
    const handleVisibility = () => { if (document.hidden) recordIntegrityEvent('visibilityHidden'); };
    const handleBlur = () => recordIntegrityEvent('blur');
    const handleCopy = () => recordIntegrityEvent('copy');
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
    };
  }, [recordIntegrityEvent]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 5 * 60 * 1000;
  const isCriticalTime = timeLeft < 1 * 60 * 1000;
  const qEstimatedMs = (question.estimatedTime || 60) * 1000;
  const qTimeRatio = Math.min(1, qTimeSpent / qEstimatedMs);
  const qTimeWarning = qTimeRatio > 0.8;

  const scale = session.settings.textScale || 1;
  const getScaleClass = () => {
    if (scale === 1.25) return 'text-[1.25em]';
    if (scale === 1.5) return 'text-[1.5em]';
    return '';
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${session.settings.theme === 'dark' ? 'dark' : ''} ${session.settings.readingMode ? 'bg-[#f4ebd8] text-slate-900' : 'bg-slate-50 dark:bg-slate-950'} ${getScaleClass()}`}>
      {/* Header */}
      <header className={`bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm ${session.settings.readingMode ? 'bg-[#fdf6e3] border-[#eaddc5] dark:bg-slate-900' : ''}`}>
        <div className="flex items-center space-x-4">
          <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">PatternIQ</div>
          <div className="hidden md:flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300">
            {question.category}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          <motion.div 
            animate={isCriticalTime ? { scale: [1, 1.05, 1], color: ['#ef4444', '#dc2626', '#ef4444'] } : {}}
            transition={{ repeat: isCriticalTime ? Infinity : 0, duration: 1 }}
            className={`flex items-center space-x-2 font-mono text-lg font-bold ${
              isCriticalTime ? 'text-red-600' : 
              isLowTime ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Clock className={`w-5 h-5 ${isCriticalTime ? 'animate-pulse' : ''}`} />
            <span>{formatTime(timeLeft)}</span>
          </motion.div>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { if(window.confirm('Are you sure you want to submit early?')) endTest() }}
            className="hidden sm:block text-sm font-bold px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 w-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${((session.currentIndex + 1) / session.questionOrder.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col relative">
        
        {/* Settings Overlay */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl p-6 z-20 w-72"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Display Settings</h3>
                <button onClick={() => setShowSettings(false)}><X className="w-5 h-5 text-slate-500 hover:text-slate-900 dark:hover:text-white" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-300">Text Scale</label>
                  <div className="flex gap-2">
                    <button onClick={() => updateSettings({ textScale: 1 })} className={`flex-1 py-1 rounded border ${scale === 1 ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>A</button>
                    <button onClick={() => updateSettings({ textScale: 1.25 })} className={`flex-1 py-1 rounded border text-lg ${scale === 1.25 ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>A</button>
                    <button onClick={() => updateSettings({ textScale: 1.5 })} className={`flex-1 py-1 rounded border text-xl ${scale === 1.5 ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>A</button>
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={session.settings.readingMode} onChange={(e) => updateSettings({ readingMode: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sepia Reading Mode</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Question {session.currentIndex + 1} <span className="opacity-50">/ {session.questionOrder.length}</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Difficulty</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(d => (
                  <div key={d} className={`w-2 h-2 rounded-full ${d <= question.difficulty ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-200 dark:bg-slate-800'}`} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${qTimeWarning ? 'text-amber-500' : 'text-slate-400'}`}>
              <Hourglass className="w-3 h-3" /> Question Timer
            </div>
            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${qTimeWarning ? 'bg-amber-500' : 'bg-blue-400 dark:bg-blue-500'}`}
                style={{ width: `${Math.max(5, qTimeRatio * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={qId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl shadow-sm border p-6 md:p-10 flex-1 flex flex-col ${session.settings.readingMode ? 'bg-white border-[#eaddc5]' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-[1.25em] font-medium text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                {question.prompt}
              </h2>
              <button 
                onClick={() => toggleFlag(qId)}
                className={`p-2 rounded-lg transition-colors ml-4 shrink-0 ${
                  session.flags[qId] 
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Flag for review"
              >
                <Flag className={`w-6 h-6 ${session.flags[qId] ? 'fill-current' : ''}`} />
              </button>
            </div>

            {question.visualData && (
              <div className="mb-10">
                <VisualArea data={question.visualData} />
              </div>
            )}

            <div className="grid gap-4 mt-auto">
              {question.choices.map((choice, i) => {
                const isSelected = answerRecord.selectedAnswer === choice;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => answerQuestion(qId, choice)}
                    className={`flex items-center text-left w-full min-h-[60px] p-4 md:p-5 rounded-xl border-2 transition-all outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-4 transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <span className="text-[1.1em] leading-snug">{choice}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center mt-8 gap-4">
          <button
            onClick={() => goToQuestion(session.currentIndex - 1)}
            disabled={session.currentIndex === 0}
            className="flex-1 md:flex-none flex justify-center items-center px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
            Previous
          </button>
          
          <button
            onClick={() => goToQuestion(session.currentIndex + 1)}
            disabled={session.currentIndex === session.questionOrder.length - 1}
            className="flex-1 md:flex-none flex justify-center items-center px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
          >
            Next
            <ChevronRight className="w-6 h-6 ml-1" />
          </button>
        </div>
      </main>
    </div>
  );
};
