import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Receipt, UtensilsCrossed, BarChart3, Settings, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SideNavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'EXPO RAIL', icon: Receipt, path: '/restaurant/orders' },
    { label: 'MENU MANAGEMENT', icon: UtensilsCrossed, path: '/restaurant/menu' },
    { label: 'ANALYTICS', icon: BarChart3, path: '/restaurant/analytics' }
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r-2 border-primary bg-surface-container-low z-50">
      {/* Station Header */}
      <div className="p-6 border-b-2 border-primary flex flex-col gap-1 bg-surface-container-high">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-primary">
          EXPO CONTROL
        </h1>
        <span className="font-mono text-xs text-on-surface-variant font-bold">STATION 01 — KITCHEN</span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider transition-colors border-y ${
                  isActive
                    ? 'bg-primary text-white border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t-2 border-primary bg-surface-container-high space-y-2">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full border-2 border-primary bg-surface-container-lowest text-primary hover:bg-error hover:text-white font-display text-xs font-bold uppercase py-2.5 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> LOGOUT KITCHEN
        </button>
      </div>
    </aside>
  );
}
