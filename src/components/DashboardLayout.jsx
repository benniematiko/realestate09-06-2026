import React, { useState } from 'react';
import { Building2, Users, FileText, CreditCard, LayoutDashboard, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { name: 'Overview Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Properties & Units', icon: Building2, active: false },
    { name: 'Tenant Directory', icon: Users, active: false },
    { name: 'Invoices & Billing', icon: FileText, active: false },
    { name: 'Payments & Receipts', icon: CreditCard, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop Viewports */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex md:flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Building2 className="h-6 w-6 text-indigo-400 mr-2" />
          <span className="text-lg font-bold tracking-tight">Apex REMS</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href="#"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-indigo-650 text-white bg-indigo-600' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-150'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main Execution Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 focus:outline-none md:hidden"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-sm font-medium text-gray-700">Administrator Mode</span>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-between text-indigo-750 font-bold justify-center text-indigo-750">
              <span className="text-xs text-indigo-700">BM</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Frame Injection */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}