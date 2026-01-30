import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InspectorApp from './inspector/InspectorApp';
import ChatApp from './chat/ChatApp';
import Login from './components/Login/Login';
import { useAuth, getAuthToken, setAuthToken } from './hooks/useAuth';

function App() {
  // Default to requiring auth (same as original behavior)
  // Only set to false if server explicitly says auth is not required
  const [authRequired, setAuthRequired] = useState(true);

  // Check server auth configuration on mount
  useEffect(() => {
    fetch('/api/system/auth-config')
      .then(res => res.json())
      .then(data => {
        // Only update if auth is NOT required (skip-auth-token mode)
        if (!data.authRequired) {
          setAuthRequired(false);
        }
      })
      .catch(() => {
        // Keep default (auth required) if we can't reach the server
      });
  }, []);

  // Handle auth token extraction from URL
  useAuth();

  // If auth is not required (skip-auth-token mode), skip login check
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
