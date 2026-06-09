import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import PropertyForm from './components/PropertyForm';
import TenantAssignForm from './components/TenantAssignForm';
import InvoiceDashboard from './components/InvoiceDashboard';
import PaymentForm from './components/PaymentForm';
import LoginForm from './components/LoginForm'; // <-- Added Auth Form
import { FileText, CreditCard, UserPlus } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('billing');

  // On initial mount, pull persistent login profiles directly out of session logs
  useEffect(() => {
    const savedToken = localStorage.getItem('userToken');
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');

    if (savedToken && savedRole && savedName) {
      setUser({ name: savedName, role: savedRole });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const tabs = [
    { id: 'billing', name: 'Billing Dashboard', icon: FileText },
    { id: 'payments', name: 'Post Payments', icon: CreditCard },
    { id: 'onboarding', name: 'Property & Tenants', icon: UserPlus },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'billing':
        return <InvoiceDashboard />;
      case 'payments':
        return <PaymentForm />;
      case 'onboarding':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <PropertyForm />
            <TenantAssignForm />
          </div>
        );
      default:
        return <InvoiceDashboard />;
    }
  };

  // 1. Session Protection Gate: Intercept unauthorized users
  if (!user) {
    return <LoginForm onLoginSuccess={(profileData) => setUser(profileData)} />;
  }

  // 2. Main Authenticated Console Viewport Frame
  return (
    <DashboardLayout onLogout={handleLogout} userProfile={user}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Eagles Mission Estate Management Portal</h1>
          <p className="text-sm text-gray-500">
            Active Identity session role level: <span className="text-indigo-600 font-bold underline">{user.role}</span>
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}