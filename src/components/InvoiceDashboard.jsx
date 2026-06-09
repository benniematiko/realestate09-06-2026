import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [billingPeriod, setBillingPeriod] = useState('June 2026');
  const [dueDate, setDueDate] = useState('');
  const [runLoading, setRunLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Fetch all current system invoices from backend
  const fetchInvoices = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/invoices');
      if (res.data.success) {
        setInvoices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to pull system billing data feed:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Handle triggering a new monthly invoice bulk run
  const handleInvoiceRun = async (e) => {
    e.preventDefault();
    if (!dueDate) {
      setActionMessage({ type: 'error', text: 'Please set a valid payment due date deadline.' });
      return;
    }
    
    setRunLoading(true);
    setActionMessage({ type: '', text: '' });

    try {
      const res = await axios.post('http://localhost:5000/api/invoices/generate', {
        billingPeriod,
        dueDate
      });

      if (res.data.success) {
        setActionMessage({ 
          type: 'success', 
          text: `Success! ${res.data.summary.successfullyGenerated} invoices generated. (Skipped ${res.data.summary.skippedDuplicates} duplicates)` 
        });
        fetchInvoices(); // Refresh tables to show new items
      }
    } catch (err) {
      setActionMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Invoice run execution encountered an error.' 
      });
    } finally {
      setRunLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Bulk Invoice Automation Control Console */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Billing Automation Engine</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Select a targeted billing cycle and deadline to auto-generate ledger invoices across all active tenant profiles.
        </p>

        {actionMessage.text && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${
            actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {actionMessage.text}
          </div>
        )}

        <form onSubmit={handleInvoiceRun} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Billing Cycle</label>
            <select
              value={billingPeriod}
              onChange={(e) => setBillingPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="June 2026">June 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="August 2026">August 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={runLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center disabled:bg-indigo-400 h-10"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {runLoading ? 'Running Invoicing Automations...' : 'Execute Monthly Billing Run'}
          </button>
        </form>
      </div>

      {/* 2. Live Master Invoices Ledger Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Master Invoices Ledger</h3>
            <p className="text-sm text-gray-500">Live operational log of all bills issued across managed units.</p>
          </div>
          <button 
            onClick={fetchInvoices}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition-colors"
          >
            Refresh Logs
          </button>
        </div>

        {tableLoading ? (
          <div className="p-12 text-center text-sm text-gray-400">Loading master ledger records...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">No system records detected. Execute a billing run above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Invoice S/N</th>
                  <th className="py-3 px-6">Tenant Account</th>
                  <th className="py-3 px-6">Unit</th>
                  <th className="py-3 px-6">Billing Cycle</th>
                  <th className="py-3 px-6 text-right">Total Due</th>
                  <th className="py-3 px-6 text-right">Balance Due</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 font-mono text-xs font-semibold text-gray-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-6 font-medium text-gray-900">{inv.tenantId?.fullName || 'N/A'}</td>
                    <td className="py-3 px-6 font-mono text-xs">{inv.unitId?.unitNumber || 'N/A'}</td>
                    <td className="py-3 px-6 text-gray-500">{inv.billingPeriod}</td>
                    <td className="py-3 px-6 text-right font-medium text-gray-900">Ksh {inv.amountDue.toLocaleString()}</td>
                    <td className="py-3 px-6 text-right font-semibold text-rose-600">Ksh {inv.amountOutstanding.toLocaleString()}</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                        inv.status === 'Partially-Paid' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {inv.status === 'Paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {inv.status === 'Unpaid' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}