import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, ShoppingBag, Receipt, User, Search, Store, LogOut, Paperclip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function BulldogRail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart ? useCart() : { cartItemsCount: 0 };

  const isRestaurantRoute = location.pathname.startsWith('/restaurant');

  const customerNav = [
    { label: 'DISCOVER', path: '/', icon: Flame },
    { label: 'SEARCH', path: '/search', icon: Search },
    { label: 'CART', path: '/cart', icon: ShoppingBag, badge: cartItemsCount },
    { label: 'ORDERS', path: '/orders', icon: Receipt },
    { label: 'PROFILE', path: '/profile', icon: User },
  ];

  const restaurantNav = [
    { label: 'EXPO RAIL', path: '/restaurant/orders', icon: Store },
    { label: 'MENU MANAGEMENT', path: '/restaurant/menu', icon: Receipt },
    { label: 'ANALYTICS', path: '/restaurant/analytics', icon: Flame },
  ];

  const navItems = isRestaurantRoute ? restaurantNav : customerNav;

  return (
    <header className="bg-primary text-on-primary border-b-4 border-secondary-container sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-secondary-container text-on-secondary-container rounded-sm flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold uppercase tracking-wider leading-none text-white group-hover:text-secondary-container transition-colors">
              THE ORDER TICKET
            </h1>
            <span className="font-mono text-[10px] text-outline-variant tracking-tighter">
              INDUSTRIAL KITCHEN UTILITARIAN
            </span>
          </div>
        </Link>

        {/* Paper-Slip Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-xs font-display uppercase tracking-wider transition-all flex items-center gap-1.5 border-t-2 ${
                  isActive
                    ? 'bg-surface-container-lowest text-primary font-bold border-secondary-container translate-y-1'
                    : 'bg-primary-container text-outline-variant hover:text-white hover:bg-surface-container-high/20 border-transparent'
                }`}
              >
                {/* Bulldog Clip Icon Effect */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-secondary-container">
                  <Paperclip className="w-3.5 h-3.5 rotate-45" />
                </div>
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 bg-secondary-container text-primary font-mono text-[10px] px-1.5 py-0.5 font-bold rounded-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Auth Action */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline text-outline-variant">
                [{user.role.toUpperCase()}: <strong className="text-white">{user.name}</strong>]
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 hover:bg-surface-container-high/20 text-outline-variant hover:text-error transition-colors flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-display text-xs">LOGOUT</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-secondary-container text-on-secondary-container font-display text-xs uppercase px-3 py-1.5 font-bold hover:bg-white transition-colors"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
