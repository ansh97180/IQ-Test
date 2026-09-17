import React, { useState } from 'react';
import { useTest } from '../../store/TestContext';
import { questions } from '../../data/questions';
import { VisualArea } from '../test/VisualArea';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export const ReviewDashboard = ({ onClose }: { onClose: () => void }) => {
  const { session } = useTest();
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'skipped' | 'flagged'>('all');

  const reviewedQuestions = session.questionOrder.map((qId, index) => {
    const q = questions.find(x => x.id === qId)!;
    const ans = session.answers[qId];
    const isCorrect = ans?.selectedAnswer === q.correctAnswer;
    const isSkipped = !ans || !ans.selectedAnswer;
    const isFlagged = session.flags[qId];
    return { q, ans, isCorrect, isSkipped, isFlagged, index: index + 1 };
  });

  const filtered = reviewedQuestions.filter(item => {
    if (filter === 'correct') return item.isCorrect && !item.isSkipped;
    if (filter === 'incorrect') return !item.isCorrect && !item.isSkipped;
    if (filter === 'skipped') return item.isSkipped;
    if (filter === 'flagged') return item.isFlagged;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pt-8 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Review Answers</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
        {['all', 'correct', 'incorrect', 'skipped', 'flagged'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {f} ({
              f === 'all' ? reviewedQuestions.length :
              f === 'correct' ? reviewedQuestions.filter(x => x.isCorrect && !x.isSkipped).length :
              f === 'incorrect' ? reviewedQuestions.filter(x => !x.isCorrect && !x.isSkipped).length :
              f === 'skipped' ? reviewedQuestions.filter(x => x.isSkipped).length :
              reviewedQuestions.filter(x => x.isFlagged).length
            })
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filtered.map(({ q, ans, isCorrect, isSkipped, index }) => (
          <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">Q{index}</span>
                <span className="text-sm font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{q.category}</span>
                <span className="text-sm font-medium text-slate-400">Diff {q.difficulty}</span>
              </div>
              <div>
                {isSkipped ? (
                  <span className="text-slate-400 font-medium text-sm flex items-center"><XCircle className="w-4 h-4 mr-1"/> Skipped</span>
                ) : isCorrect ? (
                  <span className="text-green-600 font-medium text-sm flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Correct</span>
                ) : (
                  <span className="text-red-500 font-medium text-sm flex items-center"><XCircle className="w-4 h-4 mr-1"/> Incorrect</span>
                )}
              </div>
            </div>

            <p className="text-lg font-medium mb-4 whitespace-pre-wrap">{q.prompt}</p>

            {q.visualData && (
              <div className="mb-6 max-w-sm">
                <VisualArea data={q.visualData} />
              </div>
            )}

            <div className="grid gap-2 mb-6">
              {q.choices.map(choice => {
                const isSelected = ans?.selectedAnswer === choice;
                const isActualCorrect = q.correctAnswer === choice;
                
                let bClass = 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-60';
                if (isActualCorrect) bClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium border-2';
                else if (isSelected && !isActualCorrect) bClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-2';

                return (
                  <div key={choice} className={`p-3 rounded-lg border ${bClass}`}>
                    {choice}
                    {isSelected && !isActualCorrect && <span className="ml-2 text-xs font-bold uppercase tracking-wide">Your Answer</span>}
                    {isActualCorrect && <span className="ml-2 text-xs font-bold uppercase tracking-wide text-green-600 dark:text-green-400">Correct Answer</span>}
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200">
              <strong className="block mb-1">Explanation:</strong>
              {q.explanation}
            </div>
            
            <div className="mt-4 text-xs text-slate-400 flex gap-4">
               <span>Time spent: {((ans?.timeSpent || 0) / 1000).toFixed(1)}s</span>
               <span>Estimated norm: {q.estimatedTime}s</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-12 text-slate-500">No questions match this filter.</div>
        )}
      </div>
    </div>
  );
};
