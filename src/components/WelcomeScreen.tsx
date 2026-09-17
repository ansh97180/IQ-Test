import React, { useState } from 'react';
import { useTest } from '../store/TestContext';
import { validateQuestions } from '../data/questions';

export const WelcomeScreen = () => {
  const { startTest } = useTest();
  const [agreed, setAgreed] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);

  const handleStart = () => {
    setValidating(true);
    const errors = validateQuestions();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidating(false);
      return;
    }
    startTest();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-20">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">PatternIQ</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Welcome to the PatternIQ Cognitive Assessment. This is a 120-item, browser-based evaluation designed to measure observable reasoning performance across multiple cognitive domains.
        </p>

        <div className="space-y-6 mb-10">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-5">
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Important Scientific Limitations</h3>
            <ul className="list-disc pl-5 text-amber-700 dark:text-amber-300 space-y-2 text-sm">
              <li>This is <strong>NOT</strong> a clinically validated IQ test.</li>
              <li>The results provided are an experimental interpretation and do not represent an official intelligence quotient.</li>
              <li>Accurate IQ measurement requires controlled administration, large-scale population norming, and standardized psychometric validation, which this tool does not claim to possess.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Assessment Details</h3>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1 text-sm">
              <li><strong>Length:</strong> 120 questions</li>
              <li><strong>Time limit:</strong> 70 minutes</li>
              <li><strong>Format:</strong> Multiple choice, covering numerical, spatial, logical, and visual reasoning.</li>
              <li><strong>Privacy:</strong> All data is stored locally in your browser. No data is sent to any server.</li>
            </ul>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            <h4 className="font-bold mb-2">Question Validation Failed</h4>
            <ul className="list-disc pl-5 text-sm max-h-40 overflow-y-auto space-y-1">
              {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        <label className="flex items-start space-x-3 mb-8 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <input 
            type="checkbox" 
            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            I understand that this is an experimental assessment, not a clinical tool, and I acknowledge that the provisional reasoning index is not a certified IQ score.
          </span>
        </label>

        <button
          onClick={handleStart}
          disabled={!agreed || validating}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            agreed && !validating
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {validating ? 'Validating questions...' : 'Begin Assessment'}
        </button>
      </div>
    </div>
  );
};
