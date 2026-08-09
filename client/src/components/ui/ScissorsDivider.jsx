import React from 'react';
import { Scissors } from 'lucide-react';

export default function ScissorsDivider({ label, className = '' }) {
  return (
    <div className={`relative flex items-center justify-center my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-dashed border-outline"></div>
      </div>
      <div className="relative bg-surface-container-lowest px-3 flex items-center gap-2 text-outline font-mono text-xs uppercase tracking-wider">
        <Scissors className="w-3.5 h-3.5 rotate-90" />
        {label && <span>{label}</span>}
      </div>
    </div>
  );
}
