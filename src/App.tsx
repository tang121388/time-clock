import React from 'react';
import { Layout } from './components/Layout';
import { TimeProvider } from './context/TimeContext';

function App() {
  return (
    <TimeProvider>
      <Layout />
    </TimeProvider>
  );
}

export default App;