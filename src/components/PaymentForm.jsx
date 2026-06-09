import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    tenantId: '',
    invoiceId: '',
    amountPaid: '',
    paymentMethod: 'M-Pesa',
    transactionReference: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setReceiptData(null);

    try {
      const response = await axios.post('http://localhost:5000/api/payments', {
        ...formData,
        amountPaid: Number(formData.amountPaid)
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Payment successfully processed and reconciled!' });
        setReceiptData(response.data.data);
        // Clear transaction-specific inputs to prevent accidental double-posting
        setFormData({
          tenantId: '',
          invoiceId: '',
          amountPaid: '',
          paymentMethod: 'M-Pesa',
          transactionReference: '',
          notes: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Reconciliation failure. Check inputs.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* 1. Transaction Entry Form (Spans 2 columns) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
        <div className="flex items-center space-x-2 mb-2">
          <CreditCard className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Post Tenant Payment</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Capture external cash flow streams to reconcile outstanding tenant invoices.
        </p>

        {message.text && !receiptData && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Database ID</label>
              <input
                type="text"
                name="tenantId"
                required
                value={formData.tenantId}
                onChange={handleChange}
                placeholder="Paste active Tenant ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Invoice ID</label>
              <input
                type="text"
                name="invoiceId"
                required
                value={formData.invoiceId}
                onChange={handleChange}
                placeholder="Paste target Invoice ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (Ksh)</label>
              <input
                type="number"
                name="amountPaid"
                required
                value={formData.amountPaid}
                onChange={handleChange}
                placeholder="e.g., 45000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference Code</label>
            <input
              type="text"
              name="transactionReference"
              required
              value={formData.transactionReference}
              onChange={handleChange}
              placeholder="e.g., M-Pesa Ref: RFG892KLS1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Optional)</label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add payment specific details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:bg-emerald-400"
          >
            {loading ? 'Executing Real-Time Balancing...' : 'Process Payment Receipt'}
          </button>
        </form>
      </div>

      {/* 2. Automated Ledger Allocation Receipt Panel */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between h-full min-h-[400px]">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-4">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Audit Ledger Feedback</h3>
          </div>
          
          {receiptData ? (
            <div className="space-y-6">
              <div className="flex items-center text-emerald-400 space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-semibold">Transaction Balanced Successfully</span>
              </div>

              <div className="space-y-3 font-mono text-xs border-t border-b border-slate-800 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Status:</span>
                  <span className="text-indigo-300 font-bold">{receiptData.invoiceStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Outstanding:</span>
                  <span className="text-white">Ksh {receiptData.remainingInvoiceOutstanding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenant Arrears Pool:</span>
                  <span className="text-rose-400">Ksh {receiptData.tenantRemainingArrears.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Prepaid Account Credited:</span>
                  <span className="text-emerald-400">Ksh {receiptData.tenantPrepaidBalance.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The double-entry ledger loop executed cleanly. Database values were committed across collections securely.
              </p>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-center text-xs p-4">
              Awaiting transaction posting to view real-time architectural allocation logs.
            </div>
          )}
        </div>
        
        <div className="text-[10px] text-slate-500 font-mono mt-6 pt-4 border-t border-slate-800">
          Database Mode: ATOMIC_TRANSACTION_ACTIVE
        </div>
      </div>
    </div>
  );
}