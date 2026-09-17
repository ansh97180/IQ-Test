import React from 'react';
import { TestProvider, useTest } from './store/TestContext';
import { ThemeProvider } from './store/ThemeContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TestRunner } from './components/test/TestRunner';
import { ResultsDashboard } from './components/results/ResultsDashboard';

const AppContent = () => {
  const { session } = useTest();

  // Simple state machine routing
  if (session.status === 'not-started') {
    return <WelcomeScreen />;
  }

  if (session.status === 'in-progress') {
    return <TestRunner />;
  }

  if (session.status === 'completed') {
    return <ResultsDashboard />;
  }

  return <div>Unknown state</div>;
};

export default function App() {
  return (
    <ThemeProvider>
      <TestProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
          <AppContent />
        </div>
      </TestProvider>
    </ThemeProvider>
  );
}

