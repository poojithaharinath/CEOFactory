import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle, Layers } from 'lucide-react';

const Login = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-indigo-600 p-3 rounded-2xl mb-3.5 shadow-md shadow-indigo-600/10">
            <Layers className="h-5.5 w-5.5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            CEOFactory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access the sales opportunity pipeline pipeline
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your Password"
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Quick Demo Login credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Explore Demo Environment
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail('demo@gmail.com');
                setPassword('Demo123@');
              }}
              className="w-full py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 text-slate-650 hover:text-indigo-700 rounded-xl transition-all flex flex-col items-center justify-center text-xs"
              title="Click to autofill credentials"
            >
              <span className="font-semibold">Email: <span className="font-normal text-slate-500">demo@gmail.com</span></span>
              <span className="font-semibold mt-0.5">Password: <span className="font-normal text-slate-500">Demo123@</span></span>
              <span className="text-[9px] text-indigo-500/80 font-medium mt-1">Click to autofill credentials</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-5 text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none transition-colors"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
