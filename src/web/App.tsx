import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InspectorApp from './inspector/InspectorApp';
import ChatApp from './chat/ChatApp';
import Login from './components/Login/Login';
import { useAuth, getAuthToken, setAuthToken } from './hooks/useAuth';

function App() {
  const [authRequired, setAuthRequired] = useState<boolean | null>(null);

  // Check server auth configuration on mount
  useEffect(() => {
    fetch('/api/system/auth-config')
      .then(res => res.json())
      .then(data => {
        setAuthRequired(data.authRequired);
      })
      .catch(() => {
        // Default to requiring auth if we can't reach the server
        setAuthRequired(true);
      });
  }, []);

  // Handle auth token extraction from URL
  useAuth();

  // Show loading while checking auth config
  if (authRequired === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-neutral-500 dark:text-neutral-400">Loading...</div>
      </div>
    );
  }

  // If auth is not required, skip login check
  if (!authRequired) {
    return (
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/*" element={<ChatApp />} />
          <Route path="/inspector" element={<InspectorApp />} />
        </Routes>
      </Router>
    );
  }

  // Auth is required - check if user has token
  const authToken = getAuthToken();

  if (!authToken) {
    return <Login onLogin={setAuthToken} />;
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/*" element={<ChatApp />} />
        <Route path="/inspector" element={<InspectorApp />} />
      </Routes>
    </Router>
  );
}

export default App;
