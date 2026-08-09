import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, Scissors } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser?.role === 'restaurant') {
        navigate('/restaurant/orders', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-[380px]">
        {/* Central Card */}
        <div className="bg-white rounded border border-outline w-full pb-8 shadow-none relative">
          {/* Torn Paper Edge Top */}
          <div className="clip-zigzag bg-white w-full absolute top-0 left-0 h-4 border-t border-outline"></div>
          
          <div className="pt-12 px-8 flex flex-col items-center">
            {/* Brand Header */}
            <div className="flex flex-col items-center mb-6 text-center">
              <Flame className="w-10 h-10 text-secondary-container fill-secondary-container mb-2" />
              <h1 className="font-display text-3xl font-bold text-primary tracking-tighter uppercase">
                ORDER TICKET
              </h1>
              <p className="font-mono text-xs text-on-surface-variant mt-1 tracking-wider">
                ORDER AHEAD · EAT WELL
              </p>
            </div>

            {/* Scissors Divider */}
            <div className="w-full relative flex items-center justify-center my-4">
              <div className="w-full border-t border-dashed border-outline"></div>
              <span className="absolute bg-white px-3 text-outline text-xs flex items-center gap-1 font-mono">
                <Scissors className="w-3.5 h-3.5 rotate-90" />
              </span>
            </div>

            {/* Error Feedback */}
            {error && (
              <div className="w-full bg-error-container text-on-error-container border border-error text-xs font-mono p-3 my-2 rounded-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <label className="sr-only font-display text-xs uppercase" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full border border-outline-variant rounded-sm p-3 font-body text-sm focus:border-primary focus:border-2 focus:ring-0 transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="sr-only font-display text-xs uppercase" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border border-outline-variant rounded-sm p-3 font-body text-sm focus:border-primary focus:border-2 focus:ring-0 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-secondary-container text-on-secondary-container font-display font-bold py-3.5 mt-2 rounded-sm border-2 border-transparent hover:bg-primary hover:text-white transition-colors flex justify-between items-center px-4 uppercase text-sm disabled:opacity-50"
              >
                <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Links */}
            <div className="w-full flex flex-col items-center mt-8 gap-3">
              <Link
                to="/signup"
                className="font-body text-sm text-on-surface underline hover:text-secondary transition-colors flex items-center gap-1"
              >
                New here? Create account
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
