const fs = require('fs');
let code = fs.readFileSync('src/components/results/ResultsDashboard.tsx', 'utf8');

code = code.replace(
  '<p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Your Assessment Score</p>',
  '<p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Assessment Score</p>'
);

code = code.replace(
  'Your overall score: <strong className="text-indigo-600 dark:text-indigo-400 ml-2">{results.provisionalReasoningIndex}</strong>',
  'Assessment Score: <strong className="text-indigo-600 dark:text-indigo-400 ml-2">{results.provisionalReasoningIndex}</strong>'
);

const benchmarkFooter = `<div className="text-sm text-slate-600 dark:text-slate-400 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
              <p>
                <strong>Percentiles:</strong> Percentile unavailable for this assessment (requires valid reference distribution).
              </p>
              <p>
                <strong>Limitations:</strong> This benchmark comparison uses an anonymized reference distribution. It is intended for context and personal insight only. 
              </p>
              <p>
                <strong>Reliability:</strong> Do not consider this a clinically validated IQ score. True intelligence testing requires controlled environmental administration and exhaustive population norming. Score precision may vary based on test fatigue and environmental distractions.
              </p>
            </div>`;

code = code.replace(
  /<div className="text-sm text-slate-600 dark:text-slate-400 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">[\s\S]*?<\/div>/,
  benchmarkFooter
);

fs.writeFileSync('src/components/results/ResultsDashboard.tsx', code);
