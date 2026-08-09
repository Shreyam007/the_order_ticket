import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QtyStepper({
  value = 1,
  onChange,
  min = 0,
  max = 99,
  className = ''
}) {
  const handleDecrement = () => {
    if (value > min && onChange) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && onChange) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`inline-flex items-center border-2 border-primary bg-surface-container-lowest ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center bg-surface-container hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:bg-surface-container disabled:hover:text-current transition-colors text-primary font-bold"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-10 text-center font-mono font-bold text-sm text-on-surface">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-8 h-8 flex items-center justify-center bg-surface-container hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:bg-surface-container disabled:hover:text-current transition-colors text-primary font-bold"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
