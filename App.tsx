import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Calculators from './components/Calculators';
import Byajbook from './components/Byajbook';
import Khatabook from './components/Khatabook';
import Billingbook from './components/Billingbook';
import GoldSilverbook from './components/GoldSilverbook';
import BottomNav from './components/FloatingActionButton';
import Settings from './components/Settings';
import Help from './components/Help';
import { CurrencyProvider } from './components/CurrencyContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import SplashScreen from './components/SplashScreen';
import RoleSelection from './components/RoleSelection';
import Digilocker from './components/Digilocker';
import AiDesigner from './components/AiDesigner';
import JewelAiAdviser from './components/AiSonarJiAdviser';
import Chat from './components/Chat';

// Main application layout
const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when mobile sidebar is open
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Sidebar isMobileMenuOpen={isSidebarOpen} setMobileMenuOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'role-selection' | 'main-app'>('splash');
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsSplashExiting(true);
    }, 2000);

    const stateTimer = setTimeout(() => {
      setAppState('role-selection');
    }, 2500); // Wait for fade-out to finish

    return () => {
        clearTimeout(splashTimer);
        clearTimeout(stateTimer);
    };
  }, []);

  const handleSelectRole = (role: 'customer' | 'service_provider' | 'admin') => {
    if (role === 'customer') {
      // For simulation, log in the customer with a specific phone number from mock data
      login(role, '9876543210');
    } else {
      login(role);
    }
    setAppState('main-app');
  };

  if (appState === 'splash') {
    return <SplashScreen isExiting={isSplashExiting} />;
  }

  if (appState === 'role-selection') {
    return <RoleSelection onSelectRole={handleSelectRole} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="calculators" element={<Calculators />} />
        <Route path="byajbook" element={<Byajbook />} />
        <Route path="khatabook" element={<Khatabook />} />
        <Route path="billingbook" element={<Billingbook />} />
        <Route path="gold-silver-book" element={<GoldSilverbook />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="digilocker" element={<Digilocker />} />
        <Route path="ai-designer" element={<AiDesigner />} />
        <Route path="chat" element={<Chat />} />
      </Route>
      {/* Full-screen route for AI Adviser */}
      <Route path="/jewel-ai" element={<JewelAiAdviser />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </CurrencyProvider>
  );
};

export default App;