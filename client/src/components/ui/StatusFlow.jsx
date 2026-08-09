import React from 'react';
import { Flame, ChefHat, Bike, CheckCircle2 } from 'lucide-react';

export default function StatusFlow({ currentStage = 'fired', className = '' }) {
  const normStage = (currentStage || '').toLowerCase();

  const stages = [
    { key: 'fired', label: 'FIRED', icon: Flame },
    { key: 'preparing', label: 'PREPARING', icon: ChefHat },
    { key: 'out_for_delivery', label: 'OUT FOR DELIVERY', icon: Bike },
    { key: 'delivered', label: 'DELIVERED', icon: CheckCircle2 },
  ];

  const getStageIndex = (stageKey) => {
    switch (stageKey) {
      case 'new':
      case 'fired':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
      case 'out_for_delivery':
      case 'on_the_way':
        return 2;
      case 'delivered':
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const activeIdx = getStageIndex(normStage);

  return (
    <div className={`w-full bg-surface-container p-4 border border-outline-variant rounded-sm ${className}`}>
      <div className="grid grid-cols-4 gap-2 text-center relative">
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          const isPassed = idx < activeIdx;
          const isActive = idx === activeIdx;

          let badgeColor = 'bg-surface-container-high text-outline border-outline-variant';
          if (isPassed) {
            badgeColor = 'bg-herb-green text-white border-herb-green';
          } else if (isActive) {
            badgeColor = 'bg-secondary-container text-on-secondary-container border-primary font-bold';
          }

          return (
            <div key={stg.key} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 border-2 flex items-center justify-center rounded-sm transition-all duration-300 ${badgeColor}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`font-display text-xs uppercase tracking-wider ${isActive ? 'font-bold text-primary' : isPassed ? 'text-herb-green font-medium' : 'text-outline'}`}>
                {stg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
