const fs = require('fs');
let code = fs.readFileSync('src/components/results/PDFReportTemplate.tsx', 'utf8');

// Add isViewMode to props
code = code.replace(
  'interface PDFReportTemplateProps {',
  'interface PDFReportTemplateProps {\n  isViewMode?: boolean;'
);

// Extract isViewMode from props
code = code.replace(
  'export const PDFReportTemplate = React.forwardRef<HTMLDivElement, PDFReportTemplateProps>(({ results, session }, ref) => {',
  'export const PDFReportTemplate = React.forwardRef<HTMLDivElement, PDFReportTemplateProps>(({ results, session, isViewMode = false }, ref) => {'
);

// Modify wrapper style
code = code.replace(
  '<div ref={ref} style={{ position: \'absolute\', top: \'-9999px\', left: \'-9999px\', zIndex: -100 }}>',
  '<div ref={ref} className={isViewMode ? "print-report-container" : ""} style={!isViewMode ? { position: \'absolute\', top: \'-9999px\', left: \'-9999px\', zIndex: -100 } : { display: \'flex\', flexDirection: \'column\', alignItems: \'center\', gap: \'24px\', padding: \'24px 0\' }}>'
);

// Modify pdf-page style to look like paper in view mode
code = code.replace(
  'const pageStyle: React.CSSProperties = {',
  `const pageStyle: React.CSSProperties = {
    boxShadow: isViewMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none',
    margin: isViewMode ? '0 auto' : '0',`
);

fs.writeFileSync('src/components/results/PDFReportTemplate.tsx', code);
