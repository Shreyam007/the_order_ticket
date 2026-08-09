import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Scissors, Flame, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';
import PriceLine from '../../components/ui/PriceLine';
import StatusFlow from '../../components/ui/StatusFlow';

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Error fetching order confirmation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center font-mono text-sm text-on-surface-variant">
        <Flame className="w-8 h-8 text-error animate-bounce fill-error mb-2" />
        <span>GENERATING CONFIRMATION TICKET...</span>
      </div>
    );
  }

  // Fallback demo order if order details fetch failed
  const displayOrder = order || {
    orderNumber: id.startsWith('FT-') ? id : 'FT-9012',
    restaurantName: 'THE BURGER JOINT',
    placedAt: new Date(),
    items: [
      { name: 'Classic Cheeseburger', quantity: 2, price: 450 },
      { name: 'Truffle Fries', quantity: 1, price: 220 }
    ],
    status: 'fired',
    total: 1120
  };

  const formattedDate = new Date(displayOrder.placedAt || Date.now()).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-surface-container-low min-h-screen flex flex-col items-center justify-center p-4 py-12 font-body text-on-surface">
      <div className="max-w-md w-full">
        {/* The Ticket Centerpiece */}
        <div className="bg-surface-container-lowest border-2 border-primary clip-zigzag relative p-6 md:p-8 shadow-lg">
          {/* Stamp Animated Badge Top Right */}
          <div className="absolute top-4 right-4 animate-in zoom-in-90 duration-300 transform rotate-3">
            <div className="relative inline-block px-3 py-1 bg-secondary-container border-2 border-primary text-on-secondary-container clip-luggage-tag">
              <span className="font-display text-sm font-bold uppercase tracking-wider">
                {displayOrder.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Ticket Header */}
          <div className="mb-6 pt-2">
            <span className="font-mono text-xs text-on-surface-variant uppercase font-bold block">
              ORDER #{displayOrder.orderNumber}
            </span>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-primary mt-1">
              {displayOrder.restaurantId?.name || displayOrder.restaurantName || 'THE ORDER TICKET'}
            </h1>
            <p className="font-mono text-xs text-on-surface-variant mt-1">{formattedDate}</p>
          </div>

          {/* Scissors Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t-2 border-dashed border-primary"></div>
            <span className="absolute bg-white px-3 font-mono text-xs text-outline flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 rotate-90" />
            </span>
          </div>

          {/* Itemized List */}
          <div className="space-y-3 mb-6">
            {displayOrder.items.map((item, idx) => (
              <PriceLine
                key={idx}
                qty={item.quantity}
                item={item.name}
                price={(item.price || 0) * item.quantity}
              />
            ))}
          </div>

          {/* Total */}
          <div className="border-t-2 border-primary pt-3 mb-6 flex justify-between items-baseline font-mono text-base font-bold text-primary">
            <span>TOTAL PAID</span>
            <span>₹{(displayOrder.total || 0).toFixed(2)}</span>
          </div>

          {/* Status Flow Bar */}
          <div className="mb-6">
            <span className="font-display text-xs font-bold uppercase text-on-surface-variant block mb-2">
              LIVE PROGRESS STAGE
            </span>
            <StatusFlow currentStage={displayOrder.status} />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => navigate(`/order/${displayOrder._id || displayOrder.orderNumber}/track`)}
              className="w-full bg-primary text-white border-2 border-primary py-3.5 px-4 font-display text-sm font-bold uppercase tracking-wider hover:bg-secondary-container hover:text-primary transition-colors flex justify-between items-center clip-luggage-tag"
            >
              <span>TRACK LIVE ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/"
              className="text-center font-mono text-xs text-outline hover:text-primary underline py-1"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
