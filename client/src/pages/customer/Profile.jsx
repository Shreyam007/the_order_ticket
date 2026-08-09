import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, CheckCircle, Plus, Trash2, Scissors, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '555-0199');
  const [addresses, setAddresses] = useState(
    user?.addresses && user.addresses.length > 0
      ? user.addresses
      : [
          { label: 'Home', fullAddress: '124 Kitchen St, Terminal 4', isDefault: true },
          { label: 'Work', fullAddress: '88 Trattoria Way, Station 2', isDefault: false }
        ]
  );

  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Preference Toggles
  const [dietary, setDietary] = useState('all');
  const [notifications, setNotifications] = useState({ sms: true, email: true, promos: false });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '555-0199');
      if (user.addresses && user.addresses.length > 0) {
        setAddresses(user.addresses);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    const updatedData = {
      name,
      email,
      phone,
      addresses
    };

    try {
      const res = await api.put('/auth/profile', updatedData);
      const updatedUser = { ...user, ...res.data.user };
      if (setUser) setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccessMessage('PROFILE SAVED SUCCESSFULLY!');
    } catch (err) {
      console.warn('Profile save API fallback:', err.message);
      const updatedUser = { ...user, ...updatedData };
      if (setUser) setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccessMessage('PROFILE SAVED TO LOCAL SESSION!');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    const item = {
      label: newLabel.trim() || 'Other',
      fullAddress: newAddress.trim(),
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, item]);
    setNewLabel('');
    setNewAddress('');
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  const handleSetDefaultAddress = (index) => {
    const updated = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    setAddresses(updated);
  };

  return (
    <div className="bg-surface-container-low min-h-screen font-body text-on-surface pb-24">
      {/* Ticket Header */}
      <header className="bg-surface-container border-b-2 border-primary py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-secondary-container text-on-secondary-container border-2 border-primary rounded-sm flex items-center justify-center font-display text-2xl font-bold uppercase clip-luggage-tag">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="font-mono text-xs text-outline-variant tracking-wider uppercase">CUSTOMER PROFILE TICKET</div>
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-primary">
                {name || 'USER PROFILE'}
              </h1>
              <span className="font-mono text-xs text-secondary font-bold uppercase bg-surface-container-high px-2 py-0.5 border border-outline-variant inline-block mt-1">
                ROLE: {user?.role ? user.role.toUpperCase() : 'CUSTOMER'}
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-secondary-container text-on-secondary-container border-2 border-primary px-6 py-3 font-display text-sm font-bold uppercase hover:bg-primary hover:text-white transition-colors flex items-center gap-2 clip-luggage-tag disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </header>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-secondary-container text-on-secondary-container border-2 border-primary p-4 font-mono text-xs font-bold uppercase flex items-center gap-3 clip-zigzag">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Account Information Card */}
        <section className="bg-surface-container-lowest border-2 border-primary p-6 clip-zigzag shadow-sm">
          <h2 className="font-display text-xl font-bold uppercase text-primary mb-6 pb-2 border-b-2 border-primary flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            <span>PERSONAL INFORMATION</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-outline" /> FULL NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-body text-sm text-primary focus:border-2 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-display text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-outline" /> EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-body text-sm text-primary focus:border-2 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-display text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-outline" /> PHONE NUMBER
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-mono text-sm text-primary focus:border-2 focus:border-primary outline-none transition-all"
              />
            </div>
          </form>
        </section>

        {/* Saved Delivery Addresses Section */}
        <section className="bg-surface-container-lowest border-2 border-primary p-6 clip-zigzag shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-primary">
            <h2 className="font-display text-xl font-bold uppercase text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>SAVED DELIVERY ADDRESSES</span>
            </h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="bg-primary text-white hover:bg-secondary-container hover:text-primary px-3 py-1.5 font-display text-xs font-bold uppercase transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>ADD ADDRESS</span>
            </button>
          </div>

          {/* Add Address Form */}
          {showAddAddress && (
            <div className="mb-6 bg-surface-container-low p-4 border border-primary flex flex-col gap-3">
              <h3 className="font-display text-xs uppercase font-bold text-primary">NEW ADDRESS TICKET</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Label (e.g. Home, Office)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-white border border-outline-variant p-2 font-mono text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Full Street Address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="bg-white border border-outline-variant p-2 font-body text-xs md:col-span-2 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-1 font-display text-xs text-outline hover:text-primary uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="bg-secondary-container text-on-secondary-container border border-primary px-4 py-1 font-display text-xs font-bold uppercase"
                >
                  SAVE ADDRESS
                </button>
              </div>
            </div>
          )}

          {/* Address List */}
          <div className="flex flex-col gap-3">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className={`p-4 border flex items-center justify-between gap-4 transition-colors ${
                  addr.isDefault
                    ? 'border-2 border-primary bg-secondary-container/20'
                    : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold uppercase text-primary">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-primary text-secondary-container font-mono text-[10px] px-2 py-0.5 font-bold uppercase">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-on-surface-variant mt-0.5">
                      {addr.fullAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(idx)}
                      className="font-mono text-xs text-primary underline hover:text-secondary font-bold uppercase"
                    >
                      SET DEFAULT
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="p-1 text-outline hover:text-error transition-colors"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dietary Preferences Card */}
        <section className="bg-surface-container-lowest border-2 border-primary p-6 clip-zigzag shadow-sm">
          <h2 className="font-display text-xl font-bold uppercase text-primary mb-6 pb-2 border-b-2 border-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span>DIETARY PREFERENCES</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'all', label: 'ALL FOODS' },
              { id: 'veg', label: 'VEGETARIAN ONLY' },
              { id: 'vegan', label: '100% VEGAN' }
            ].map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => setDietary(pref.id)}
                className={`p-3 font-display text-xs font-bold uppercase border text-center transition-colors ${
                  dietary === pref.id
                    ? 'bg-secondary-container text-on-secondary-container border-2 border-primary'
                    : 'bg-surface-container-low text-outline border-outline-variant hover:bg-surface-container-high'
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
