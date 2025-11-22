import React, { useState } from 'react';
import { PeriodicTableExplorer } from './components/PeriodicTableExplorer';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [showApp, setShowApp] = useState(false);

  return (
    <>
      {showApp ? (
        <PeriodicTableExplorer onBack={() => setShowApp(false)} />
      ) : (
        <LandingPage onStart={() => setShowApp(true)} />
      )}
    </>
  );
}