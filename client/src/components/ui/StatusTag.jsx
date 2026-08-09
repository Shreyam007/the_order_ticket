import React from 'react';

export default function StatusTag({ status = 'fired', label, className = '' }) {
  const normStatus = (status || '').toLowerCase().replace(/\s+/g, '_');

  const getStatusConfig = () => {
    switch (normStatus) {
      case 'fired':
      case 'new':
        return {
          bg: 'bg-secondary-container text-on-secondary-container border border-primary/20',
          text: label || 'FIRED'
        };
      case 'preparing':
        return {
          bg: 'bg-[#E5B537] text-primary border border-primary/30',
          text: label || 'PREPARING'
        };
      case 'ready':
      case 'completed':
        return {
          bg: 'bg-herb-green text-white border border-herb-green-light',
          text: label || 'READY'
        };
      case 'out_for_delivery':
      case 'on_the_way':
        return {
          bg: 'bg-plum text-white border border-plum/80',
          text: label || 'OUT FOR DELIVERY'
        };
      case 'delivered':
        return {
          bg: 'bg-herb-green text-white border border-herb-green-light',
          text: label || 'DELIVERED'
        };
      case 'cancelled':
      case 'spicy':
      case 'urgent':
        return {
          bg: 'bg-error text-white border border-error-container',
          text: label || 'CANCELLED'
        };
      default:
        return {
          bg: 'bg-secondary-container text-on-secondary-container',
          text: label || normStatus.toUpperCase()
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider clip-luggage-tag ${config.bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      <span>{config.text}</span>
    </span>
  );
}
