import React from 'react';

export default function PriceLine({
  qty = 1,
  item = '',
  addOns = [],
  price = 0,
  className = ''
}) {
  const formattedPrice = typeof price === 'number' ? `₹${price.toFixed(2)}` : price;

  return (
    <div className={`font-mono text-sm py-1 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2 min-w-0 flex-1">
          {qty > 0 && (
            <span className="font-bold text-on-surface-variant flex-shrink-0">
              ×{qty}
            </span>
          )}
          <span className="truncate text-on-surface">{item}</span>
          <div className="flex-1 border-b border-dotted border-outline-variant mx-1 self-end mb-1"></div>
        </div>
        <span className="font-bold text-on-surface flex-shrink-0">
          {formattedPrice}
        </span>
      </div>
      {addOns.length > 0 && (
        <div className="pl-6 text-xs text-on-surface-variant italic">
          {addOns.join(', ')}
        </div>
      )}
    </div>
  );
}
