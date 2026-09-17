const fs = require('fs');

const code = `import React, { useState } from 'react';
import { useTest } from '../store/TestContext';
import { validateQuestions } from '../data/questions';
import { Clock, ShieldCheck, Settings, Globe, ArrowRight, Play } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Language, useTranslation } from '../i18n';

export const WelcomeScreen = () => {
  const { startTest } = useTest();
  const [step, setStep] = useState<'language' | 'instructions' | 'practice'>('language');
  const [lang, setLang] = useState<Language>('en');
  
  const [duration, setDuration] = useState<number>(30); // Default to 30 minutes
  const [validating, setValidating] = useState(false);
  
  const t = useTranslation(lang);

  const handleStart = () => {
    setValidating(true);
    const errors = validateQuestions();
    if (errors.length > 0) {
      alert("Validation failed: " + errors.join(", "));
      setValidating(false);
      return;
    }
    startTest(duration);
  };

  const renderLanguageSelection = () => (
    <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <Globe className="w-16 h-16 text-blue-500 mb-4" />
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">PatternIQ</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
        Select your preferred language to begin the assessment.
      </p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {(['en', 'hi', 'zh', 'hinglish'] as Language[]).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={\`p-4 rounded-xl border-2 transition-all font-medium \${
              lang === l 
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'border-slate-200 text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:text-slate-300'
            }\`}
          >
            {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी (Hindi)' : l === 'zh' ? '中文 (Chinese)' : 'Hinglish'}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep('instructions')}
        className="w-full max-w-md py-4 rounded-xl font-semibold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center justify-center mt-8"
      >
        Continue <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );

  const renderInstructions = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('instructions_title')}</h1>
      
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-6">
        <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2"/> {t('important_limitations')}
        </h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
          {t('limitations_text')}
        </p>
      </div>

      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400">
        <p>{t('instructions_text')}</p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li>Ensure you are in a quiet environment.</li>
          <li>Do not use external calculators or aids.</li>
          <li>Some questions have a time limit.</li>
        </ul>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setStep('practice')}
          className="flex-1 py-4 rounded-xl font-semibold text-lg bg-white dark:bg-slate-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-center"
        >
          {t('practice_button')}
        </button>
        <button
          onClick={handleStart}
          disabled={validating}
          className="flex-1 py-4 rounded-xl font-semibold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all text-center"
        >
          {t('skip_practice')}
        </button>
      </div>
    </div>
  );

  const renderPractice = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Practice Question</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Which number completes the sequence: 2, 4, 8, 16, ?
      </p>
      <div className="grid grid-cols-2 gap-4">
        {['24', '32', '64', '20'].map(opt => (
          <button key={opt} onClick={() => alert(opt === '32' ? 'Correct!' : 'Incorrect. The pattern doubles each time (32).')} className="p-4 border rounded-xl hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors">
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={handleStart}
        disabled={validating}
        className="w-full py-4 rounded-xl font-semibold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center justify-center mt-8"
      >
        <Play className="w-5 h-5 mr-2" /> {t('start_button')}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
        {step === 'language' && renderLanguageSelection()}
        {step === 'instructions' && renderInstructions()}
        {step === 'practice' && renderPractice()}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/WelcomeScreen.tsx', code);
