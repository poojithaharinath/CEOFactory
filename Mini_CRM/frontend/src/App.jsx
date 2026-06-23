import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login'); // login, register

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent" />
        <p className="text-sm text-slate-400 font-medium tracking-wide">Aurum CRM initializing...</p>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'register') {
      return <Register onNavigateToLogin={() => setCurrentPage('login')} />;
    }
    return <Login onNavigateToRegister={() => setCurrentPage('register')} />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
