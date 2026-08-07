import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import { authenticateUser } from '../services/auth';

export const LoginLandingPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authenticateUser(username, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Authentication Failed');
      }
    } catch (err) {
      setError('Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Radial Glow */}
      <div className="login-glow-1" />
      <div className="login-glow-2" />

      <div className="login-card-wrapper">
        
        {/* Brand Header */}
        <div className="login-header">
          <span className="badge badge-todo mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 inline" />
            &nbsp;SECURE ACCESS GATEWAY
          </span>
          <h1 className="text-3xl font-black font-heading text-white tracking-tight gradient-text">
            LEAD CONVERTERS
          </h1>
          <p className="text-xs text-gray-400">
            Malnad Webs Authorized Lead Publishing Suite
          </p>
        </div>

        {/* Login Glassmorphism Card */}
        <div className="glass-panel login-card">
          
          <div className="login-card-header">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">System Authentication</h2>
              <p className="text-11px text-gray-400">Enter your credentials to access pipeline</p>
            </div>
            <div className="login-lock-badge">
              <Lock className="w-5 h-5 text-slate-950" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="form-group">
              <label className="form-label">
                Username
              </label>
              <div className="input-group">
                <User className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-input"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Authenticate & Enter'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </form>
        </div>

        {/* Footer info */}
        <div className="login-footer">
          Malnad Webs Lead Converters &copy; {new Date().getFullYear()} — Secure Gateway
        </div>

      </div>
    </div>
  );
};
