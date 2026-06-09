import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TenantAssignForm() {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    propertyId: '',
    unitId: '', // For absolute simplicity in this step, paste a generated Unit ID string from database
    leaseStart: '',
    leaseEnd: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch active property references when loading the view
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/properties');
        if (res.data.success) setProperties(res.data.data);
      } catch (err) {
        console.error('Failed to pull property drop-down assets:', err);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/tenants/assign', formData);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Tenant successfully assigned to unit ledger!' });
        setFormData({ fullName: '', email: '', phoneNumber: '', propertyId: '', unitId: '', leaseStart: '', leaseEnd: '' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error executing tenant placement.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-xl">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Onboard & Assign Tenant</h2>
      <p className="text-sm text-gray-500 mb-4">Register a new tenant profile and link them to an active, vacant room code.</p>

      {message.text && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., +254712345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Property Link</label>
            <select
              name="propertyId"
              required
              value={formData.propertyId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="">-- Choose Building --</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Unit Database ID</label>
            <input
              type="text"
              name="unitId"
              required
              value={formData.unitId}
              onChange={handleChange}
              placeholder="Paste generated Unit ID string"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start Date</label>
            <input
              type="date"
              name="leaseStart"
              required
              value={formData.leaseStart}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date</label>
            <input
              type="date"
              name="leaseEnd"
              value={formData.leaseEnd}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-slate-600"
        >
          {loading ? 'Processing System Assignment...' : 'Execute Placement & Lock Unit'}
        </button>
      </form>
    </div>
  );
}