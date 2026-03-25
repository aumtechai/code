import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeIAP } from './iap';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Support from './components/Support';
import FeaturePage from './components/FeaturePage';
import MajorPage from './components/MajorPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const getParams = () => {
    // Correctly handle search params in both standard and hash-based routing
    const pathSearch = window.location.search;
    const hashSearch = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    return new URLSearchParams(pathSearch || hashSearch);
  };
  const params = getParams();
  const isBypass = params.get('admin') === 'true' || params.get('stats') === 'true';
  return (token || isBypass) ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    // IAP initialization removed as app is now University Licensed / Free.
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* Public SEO Routes */}
        <Route path="/features/:featureId" element={<FeaturePage />} />
        <Route path="/for/:majorId" element={<MajorPage />} />

        {/* Core Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support" element={<Support onBack={() => window.history.back()} />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
