import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import RecordDataForm from './components/RecordDataForm';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* Placeholders for other routes */}
          <Route path="history" element={<div>History Page</div>} />
          <Route path="trends" element={<div>Trends Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
        <Route path="/log" element={<RecordDataForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
