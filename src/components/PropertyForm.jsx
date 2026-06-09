import React, { useState } from 'react';
import axios from 'axios';

export default function PropertyForm({ onPropertyCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Residential',
    address: '',
    totalUnits: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Connects directly to our Express backend route
      const response = await axios.post('http://localhost:5000/api/properties', {
        ...formData,
        totalUnits: Number(formData.totalUnits)
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Property created successfully!' });
        setFormData({ name: '', type: 'Residential', address: '', totalUnits: '' });
        if (onPropertyCreated) onPropertyCreated();
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to establish connection to server.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-xl">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Add New Property</h2>
      <p className="text-sm text-gray-500 mb-4">Register a new estate building or commercial complex complex portfolio.</p>

      {message.text && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Elgon Heights Apartments"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Mixed-Use">Mixed-Use</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Units Count</label>
            <input
              type="number"
              name="totalUnits"
              required
              value={formData.totalUnits}
              onChange={handleChange}
              placeholder="e.g., 24"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g., Ngong Road, Nairobi"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-indigo-400"
        >
          {loading ? 'Saving Property Asset...' : 'Save Property Profile'}
        </button>
      </form>
    </div>
  );
}