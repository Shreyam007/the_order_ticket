import React from 'react';
import StatusTag from './StatusTag';

export default function TicketCard({
  children,
  className = '',
  status,
  title,
  cutPosition = 'bottom', // 'top', 'bottom', 'both'
  ...props
}) {
  const getCutStyle = () => {
    if (cutPosition === 'both') {
      return 'clip-zigzag pt-6 pb-6';
    }
    if (cutPosition === 'top') {
      return 'clip-zigzag pt-6';
    }
    return 'clip-zigzag pb-6';
  };

  return (
    <div
      className={`bg-surface-container-lowest border border-outline rounded-sm relative shadow-none ${getCutStyle()} ${className}`}
      {...props}
    >
      {status && (
        <div className="absolute top-4 right-4 z-10">
          <StatusTag status={status} />
        </div>
      )}
      {children}
    </div>
  );
}
