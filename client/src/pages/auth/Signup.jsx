import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Scissors, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)} (Current Location)`
          }));
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            address: '123 Prep St, Unit 4 (Default Location)'
          }));
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setSubmitting(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address
      });
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex flex-col items-center justify-center p-4 md:p-8 font-body text-on-surface">
      {/* Top Header */}
      <header className="w-full max-w-lg mb-6 flex justify-center">
        <h1 className="font-display text-4xl uppercase tracking-tight text-primary font-bold">
          The Order Ticket
        </h1>
      </header>

      {/* Ticket Container */}
      <main className="w-full max-w-md bg-surface-container-lowest border-2 border-outline relative shadow-none clip-zigzag pt-4 pb-8 flex flex-col">
        {/* Status Tag */}
        <div className="absolute top-6 right-0 bg-secondary-container text-on-secondary-container font-display text-xs font-bold px-4 py-1 border-y-2 border-l-2 border-primary uppercase z-10 clip-luggage-tag">
          NEW ACCOUNT
        </div>

        <div className="px-6 md:px-10 pt-8 pb-4 flex-grow">
          {error && (
            <div className="w-full bg-error-container text-on-error-container border border-error text-xs font-mono p-3 mb-4 rounded-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-on-surface-variant uppercase" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-none px-3 py-2 font-body text-sm text-on-surface focus:border-primary focus:border-2 outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-on-surface-variant uppercase" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. name@kitchen.com"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-none px-3 py-2 font-body text-sm text-on-surface focus:border-primary focus:border-2 outline-none"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-on-surface-variant uppercase" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 555-0198"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-none px-3 py-2 font-body text-sm text-on-surface focus:border-primary focus:border-2 outline-none"
              />
            </div>

            {/* Scissors Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-dashed border-outline"></div>
              <span className="absolute bg-white px-3 text-outline text-xs flex items-center gap-1 font-mono">
                <Scissors className="w-3.5 h-3.5 rotate-90" />
              </span>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-on-surface-variant uppercase" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-none px-3 py-2 font-body text-sm text-on-surface focus:border-primary focus:border-2 outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-on-surface-variant uppercase" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-none px-3 py-2 font-body text-sm text-on-surface focus:border-primary focus:border-2 outline-none"
              />
            </div>

            {/* Scissors Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-dashed border-outline"></div>
              <span className="absolute bg-white px-3 text-outline text-xs flex items-center gap-1 font-mono">
                <Scissors className="w-3.5 h-3.5 rotate-90" />
              </span>
            </div>

            {/* Address Section */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-mono text-xs text-on-surface-variant uppercase" htmlFor="address">
                  Delivery Address
                </label>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="flex items-center gap-1 text-primary hover:text-secondary underline text-xs font-mono"
                >
                  <MapPin className="w-3.5 h-3.5" /> Use current location
                </button>
              </div>
              <textarea
                id="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Prep St, Unit 4"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-none px-3 py-2 font-body text-sm text-on-surface resize-none focus:border-primary focus:border-2 outline-none"
              ></textarea>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full bg-primary text-white font-display text-sm font-bold py-3.5 border-2 border-primary uppercase hover:bg-secondary-container hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer Link */}
      <footer className="mt-6 text-center">
        <Link
          to="/login"
          className="font-mono text-xs text-primary underline underline-offset-4 font-bold hover:text-secondary transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </footer>
    </div>
  );
}
