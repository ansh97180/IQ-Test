import React from 'react';
import { VisualData } from '../../types';

interface VisualAreaProps {
  data: VisualData;
}

export const VisualArea: React.FC<VisualAreaProps> = ({ data }) => {
  // A generic renderer that takes visual data strings and maps them to SVGs or styled divs.
  // For simplicity in this demo, we'll map known strings to CSS shapes/emoji/SVG icons.
  
  const renderElement = (el: string, index: number) => {
    // A mapping function to render the visual elements.
    // In a full production app, this would use robust SVG definitions.
    // Here we'll use some semantic CSS and basic SVGs based on our data keys.
    
    let content = <div className="text-sm text-slate-400">{el}</div>;

    if (el === '?') content = <div className="text-4xl font-light text-blue-500">?</div>;
    
    // Number Sequences (Visual representation if needed, though they don't use this usually)
    
    // Visual Pattern examples
    if (el === 'lg-circle') content = <div className="w-16 h-16 rounded-full bg-slate-800 dark:bg-slate-200" />;
    if (el === 'sm-square') content = <div className="w-8 h-8 bg-slate-800 dark:bg-slate-200" />;
    if (el === 'white-circle') content = <div className="w-12 h-12 rounded-full border-4 border-slate-800 dark:border-slate-200" />;
    if (el === 'black-circle') content = <div className="w-12 h-12 rounded-full bg-slate-800 dark:bg-slate-200" />;
    if (el === 'white-triangle') content = <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-slate-800 dark:border-b-slate-200" style={{ borderBottomColor: 'transparent', borderBottom: '40px solid currentColor' }} />;
    // Just rendering text labels for complex shapes for the sake of the codebase limit,
    // styled nicely to look like placeholders for SVGs.
    
    if (typeof el === 'string' && el.includes('-')) {
       // generic badge for placeholders
       content = <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 font-mono text-xs text-center break-words">{el}</div>
    }

    return (
      <div key={index} className="flex items-center justify-center min-w-[80px] min-h-[80px] p-2 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
        {content}
      </div>
    );
  };

  if (data.type === 'sequence') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        {data.elements.map((el, i) => (
          <React.Fragment key={i}>
            {renderElement(el, i)}
            {i < data.elements.length - 1 && (
              <div className="text-slate-300 dark:text-slate-700">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (data.type === 'matrix') {
    // determine grid columns (sqrt of length typically, e.g. 2x2 or 3x3)
    const cols = Math.sqrt(data.elements.length);
    const gridCols = cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-4';
    
    return (
      <div className="flex justify-center p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className={`grid ${gridCols} gap-4`}>
          {data.elements.map((el, i) => renderElement(el, i))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center bg-slate-100 rounded-xl">
      Unsupported visual format
    </div>
  );
};
