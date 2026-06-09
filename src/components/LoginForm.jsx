import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, Building2, AlertTriangle } from 'lucide-react';

export default function LoginForm({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      if (response.data.success) {
        const { token, data } = response.data;
        
        // Save the session metrics securely inside the browser storage pool
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.name);
        
        // Pass the successfully authorized profile state back up to the App root
        onLoginSuccess(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failure. Check credentials and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 space-y-6">
        
        {/* Header Visual Identity Branding */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-3">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Apex REMS Secure Login</h2>
          <p className="text-sm text-gray-500 mt-1">Real Estate Management Console Gate</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-medium flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                required
                value={credentials.email}
                onChange={handleChange}
                placeholder="manager@missionestate.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Account Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm disabled:bg-slate-700"
          >
            {loading ? 'Verifying Encrypted Session...' : 'Unlock Management Console'}
          </button>
        </form>
      </div>
    </div>
  );
}