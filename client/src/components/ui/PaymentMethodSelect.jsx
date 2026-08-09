import React from 'react';
import { CreditCard, QrCode, Banknote, Wallet, Check } from 'lucide-react';

export default function PaymentMethodSelect({ selectedMethod = 'card', onChange }) {
  const methods = [
    {
      id: 'card',
      label: 'Credit / Debit Card',
      icon: CreditCard,
      fields: (
        <div className="p-4 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Card Number (e.g. 4532 1100 8921 4452)"
            className="w-full border border-outline-variant p-2 font-mono text-xs bg-surface-container-low focus:border-2 focus:border-primary outline-none"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 border border-outline-variant p-2 font-mono text-xs bg-surface-container-low focus:border-2 focus:border-primary outline-none"
            />
            <input
              type="password"
              placeholder="CVC"
              className="w-1/2 border border-outline-variant p-2 font-mono text-xs bg-surface-container-low focus:border-2 focus:border-primary outline-none"
            />
          </div>
        </div>
      )
    },
    {
      id: 'upi',
      label: 'UPI / GPay / PhonePe',
      icon: QrCode,
      fields: (
        <div className="p-4">
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. name@upi or name@okaxis)"
            className="w-full border border-outline-variant p-2 font-mono text-xs bg-surface-container-low focus:border-2 focus:border-primary outline-none"
          />
        </div>
      )
    },
    {
      id: 'cod',
      label: 'Cash on Delivery (COD)',
      icon: Banknote,
      fields: (
        <div className="p-4 font-mono text-xs text-on-surface-variant">
          ✓ Pay cash to rider upon delivery. Please keep exact change ready.
        </div>
      )
    },
    {
      id: 'wallet',
      label: 'Kitchen Pay Wallet',
      icon: Wallet,
      fields: (
        <div className="p-4 font-mono text-xs text-on-surface-variant flex items-center justify-between">
          <span>Available Wallet Balance: <strong>₹1,250.00</strong></span>
          <span className="text-herb-green font-bold">✓ Sufficient Balance</span>
        </div>
      )
    }
  ];

  return (
    <div className="border-2 border-primary bg-surface-container-lowest divide-y-2 divide-primary">
      {methods.map((m) => {
        const Icon = m.icon;
        const isSelected = selectedMethod === m.id;

        return (
          <div key={m.id} className="relative">
            <button
              type="button"
              onClick={() => onChange(m.id)}
              className={`w-full flex items-center p-4 text-left transition-colors ${
                isSelected
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'hover:bg-surface-container-low text-primary'
              }`}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-display text-sm uppercase flex-grow tracking-wider">
                {m.label}
              </span>
              <div
                className={`w-4 h-4 border-2 border-primary flex items-center justify-center ${
                  isSelected ? 'bg-primary text-white' : 'bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>

            {/* Smooth height transition container */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isSelected ? 'max-h-60 border-t-2 border-primary bg-surface-container-lowest' : 'max-h-0'
              }`}
            >
              {m.fields}
            </div>
          </div>
        );
      })}
    </div>
  );
}
