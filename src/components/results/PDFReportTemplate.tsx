import React, { useRef } from 'react';
import { AssessmentResults, TestSession } from '../../types';
import { getPerformanceInsight } from '../../utils/performanceInsights';

interface PDFReportTemplateProps {
  isViewMode?: boolean;
  results: AssessmentResults;
  session: TestSession;
}



export const PDFReportTemplate = React.forwardRef<HTMLDivElement, PDFReportTemplateProps>(({ results, session, isViewMode = false }, ref) => {
  const domains = [
    { name: "Fluid Reasoning (GF)", score: results.fluidIntelligence },
    { name: "Crystallized Knowledge (GC)", score: results.crystallizedIntelligence },
    { name: "Working Memory (GWM)", score: results.workingMemoryCapacity },
    { name: "Processing Speed (Gs)", score: results.cognitiveProcessingSpeed },
    { name: "Visual-Spatial Processing (Gv)", score: results.categoryScores['Spatial Reasoning']?.accuracy ? Math.round(70 + results.categoryScores['Spatial Reasoning'].accuracy * 70) : null },
    { name: "Auditory Processing (Ga)", score: null },
    { name: "Long-Term Retrieval (Glr)", score: null },
    { name: "Quantitative Knowledge (Gq)", score: results.categoryScores['Mathematical Logic']?.accuracy ? Math.round(70 + results.categoryScores['Mathematical Logic'].accuracy * 70) : null },
    { name: "Reading & Writing (Grw)", score: null },
  ];

  const formatDate = (ms: number | null) => {
    if (!ms) return "Not available";
    return new Date(ms).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // A4 size in pixels at 96 DPI: 794 x 1123
  const pageStyle: React.CSSProperties = {
    boxShadow: isViewMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none',
    margin: isViewMode ? '0 auto' : '0',
    width: '794px',
    height: '1123px',
    padding: '48px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontFamily: 'sans-serif',
    boxSizing: 'border-box',
    position: 'relative'
  };

  return (
    <div ref={ref} className={isViewMode ? "print-report-container" : ""} style={!isViewMode ? { position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 } : { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '24px 0' }}>
      {/* PAGE 1 */}
      <div className="pdf-page" style={pageStyle}>
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Cognitive Assessment Report</h1>
            <p style={{ margin: 0, color: '#64748b', fontWeight: 500 }}>Official Performance Summary</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px', color: '#64748b' }}>
            <p style={{ margin: '0 0 4px 0' }}><strong>Report ID:</strong> {session.sessionId.toUpperCase()}</p>
            <p style={{ margin: 0 }}><strong>Date:</strong> {formatDate(session.endTime)}</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Overall Assessment Result</h2>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Provisional Index</p>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#4f46e5', margin: '0 0 8px 0', lineHeight: 1 }}>{results.provisionalReasoningIndex}</div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                {results.provisionalBand}
              </div>
            </div>
            <div style={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Accuracy</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{(results.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Time Taken</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{formatTime(results.totalTimeMs)}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Questions Completed</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{results.rawScore} / {results.totalQuestions}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Consistency</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{(results.consistencyScore * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '24px' }}>Cognitive Profile</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {domains.slice(0, 5).map((domain, idx) => (
              <div key={idx} style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{domain.name}</h3>
                  <div style={{ fontSize: '18px', fontWeight: 900 }}>
                    {domain.score !== null ? domain.score : <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#94a3b8' }}>Not available</span>}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {getPerformanceInsight(domain.name, domain.score)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="pdf-page" style={pageStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
          {domains.slice(5).map((domain, idx) => (
            <div key={idx} style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{domain.name}</h3>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>
                  {domain.score !== null ? domain.score : <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#94a3b8' }}>Not available</span>}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {getPerformanceInsight(domain.name, domain.score)}
              </p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '32px', marginTop: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Benchmark / Reference Comparison</h2>
          <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '24px', lineHeight: 1.6 }}>
              The scores presented above are provisional estimates derived from your performance on this specific digital assessment. 
              They are compared against an anonymized reference distribution with an average mean of 100 and a standard deviation of 15.
            </p>
            
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', padding: '0 8px' }}>
                <span>Lower</span>
                <span>Average (100)</span>
                <span>Higher</span>
              </div>
              <div style={{ position: 'relative', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '9999px', width: '100%', overflow: 'hidden' }}>
                {/* Average Band shaded region */}
                <div style={{ position: 'absolute', left: '33%', right: '33%', top: 0, bottom: 0, backgroundColor: '#cbd5e1', opacity: 0.5 }}></div>
                {/* Center Line */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: '#94a3b8' }}></div>
                {/* User Score Marker */}
                <div 
                  style={{ 
                    position: 'absolute', top: 0, bottom: 0, width: '16px', backgroundColor: '#4f46e5', borderRadius: '9999px',
                    transform: 'translateX(-50%)',
                    left: `${Math.max(10, Math.min(90, ((results.provisionalReasoningIndex - 70) / (130 - 70)) * 100))}%`
                  }}
                ></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                Your overall score: <strong style={{ color: '#4f46e5' }}>{results.provisionalReasoningIndex}</strong>
              </div>
            </div>
            
            <div style={{ fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '16px', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Limitations:</strong> This report is auto-generated for personal insight. It is not a clinical diagnosis, nor is it a standardized psychometric evaluation administered under controlled clinical conditions.</p>
              <p style={{ margin: 0 }}>Scores may vary based on environmental distractions, device types, and language proficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PDFReportTemplate.displayName = 'PDFReportTemplate';
