import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, ChevronDown, ChevronUp, Flame, Paperclip } from 'lucide-react';
import api from '../../api/client';
import { useSSE } from '../../hooks/useSSE';
import StatusFlow from '../../components/ui/StatusFlow';
import PriceLine from '../../components/ui/PriceLine';

export default function LiveTracking() {
  const { id } = useParams();
  const { lastEvent } = useSSE();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandDetails, setExpandDetails] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.type === 'order:statusChanged' && (lastEvent.data.orderId === id || lastEvent.data.orderNumber === id)) {
        setOrder((prev) => (prev ? { ...prev, status: lastEvent.data.status } : prev));
      } else if (lastEvent.type === 'order:riderAssigned' && (lastEvent.data.orderId === id || lastEvent.data.orderNumber === id)) {
        setOrder((prev) => (prev ? { ...prev, riderInfo: lastEvent.data.riderInfo } : prev));
      }
    }
  }, [lastEvent, id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Error fetching order for tracking:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center font-mono text-sm text-on-surface-variant">
        <Flame className="w-8 h-8 text-error animate-bounce fill-error mb-2" />
        <span>CONNECTING TO LIVE SSE TRACKING STREAM...</span>
      </div>
    );
  }

  const currentOrder = order || {
    orderNumber: id.startsWith('FT-') ? id : 'FT-8841',
    restaurantName: 'THE BURGER JOINT',
    status: 'fired',
    total: 545,
    items: [{ name: 'Classic Cheeseburger', quantity: 2, price: 450 }],
    riderInfo: { name: 'Vikram', phone: '555-0199', vehicle: 'Red Scooter (Plate: FT-88)' }
  };

  return (
    <div className="bg-surface-container-low text-primary min-h-screen flex flex-col items-center justify-center p-4 py-8 font-body">
      <main className="w-full max-w-md mx-auto">
        {/* The Ticket Card */}
        <article className="bg-surface-container-lowest border-2 border-primary relative mb-6 clip-zigzag shadow-lg">
          {/* Bulldog Clip Header */}
          <div className="flex flex-col items-center pt-4 pb-4 border-b-2 border-primary bg-surface-container-high relative">
            <Paperclip className="w-4 h-4 text-primary absolute -top-3 rotate-45" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-primary mt-1">
              ORDER TRACKING
            </h1>
            <div className="font-mono text-xs text-on-surface-variant flex gap-2 mt-1">
              <span>#{currentOrder.orderNumber}</span>
              <span>|</span>
              <span>{currentOrder.restaurantId?.name || currentOrder.restaurantName}</span>
            </div>
          </div>

          {/* Hero Countdown */}
          <div className="px-6 py-8 text-center border-b-2 border-primary bg-surface-container-lowest">
            <h2 className="font-mono text-5xl font-bold text-primary mb-1">24 MIN</h2>
            <p className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              ESTIMATED ARRIVAL TIME
            </p>
          </div>

          {/* Status Flow Tracker */}
          <div className="p-6 border-b-2 border-primary">
            <span className="font-display text-xs font-bold uppercase text-on-surface-variant block mb-3">
              LIVE SSE STATUS STREAM
            </span>
            <StatusFlow currentStage={currentOrder.status} />
          </div>

          {/* Rider Card */}
          <div className="p-6 border-b-2 border-primary bg-surface-container-low">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border-2 border-primary bg-primary text-white flex items-center justify-center font-display font-bold text-lg">
                  {currentOrder.riderInfo?.name?.charAt(0) || 'V'}
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-primary">
                    Rider: {currentOrder.riderInfo?.name || 'Vikram'}
                  </p>
                  <p className="font-body text-xs text-on-surface-variant">
                    {currentOrder.riderInfo?.vehicle || 'On the way with your ticket'}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${currentOrder.riderInfo?.phone || '5550199'}`}
                className="p-2.5 border-2 border-primary bg-secondary-container text-on-secondary-container hover:bg-primary hover:text-white transition-colors"
                title="Call Rider"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Order Summary Expander */}
          <div className="p-6">
            <div className="flex justify-between items-center font-mono text-sm font-bold text-primary">
              <span>{currentOrder.items?.length || 1} Items</span>
              <span>₹{(currentOrder.total || 0).toFixed(2)}</span>
            </div>

            <button
              onClick={() => setExpandDetails(!expandDetails)}
              className="font-body text-xs text-primary underline mt-2 flex items-center gap-1 font-bold"
            >
              {expandDetails ? 'Hide item details' : 'Expand item details'}
              {expandDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {expandDetails && (
              <div className="mt-4 pt-3 border-t border-dashed border-outline-variant space-y-2">
                {currentOrder.items?.map((item, idx) => (
                  <PriceLine
                    key={idx}
                    qty={item.quantity}
                    item={item.name}
                    price={(item.price || 0) * item.quantity}
                  />
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/orders" className="font-mono text-xs text-primary underline font-bold hover:text-secondary">
            View All Order History Tickets →
          </Link>
        </div>
      </main>
    </div>
  );
}
