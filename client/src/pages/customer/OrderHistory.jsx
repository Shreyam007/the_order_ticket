import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Receipt, ArrowRight, Scissors } from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import TicketCard from '../../components/ui/TicketCard';
import PriceLine from '../../components/ui/PriceLine';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order) => {
    clearCart();
    order.items.forEach((item) => {
      const dishObj = {
        _id: item.dishId || 'dish_reorder',
        name: item.name,
        price: item.price,
        restaurantId: order.restaurantId?._id || order.restaurantId
      };
      addToCart(dishObj, item.quantity, item.selectedAddOns || [], item.specialInstructions || '');
    });
    navigate('/cart');
  };

  return (
    <div className="bg-surface-container-low min-h-screen font-body text-on-surface">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-end border-b-2 border-primary pb-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase text-primary tracking-tight">
              ORDER TICKETS HISTORY
            </h1>
            <p className="font-mono text-xs text-on-surface-variant">PAST TRANSACTIONS & RE-ORDERS</p>
          </div>
          <div className="font-mono text-xs font-bold text-primary bg-surface-container-lowest px-3 py-1 border border-outline-variant">
            {orders.length} TOTAL TICKETS
          </div>
        </header>

        {loading ? (
          <div className="py-16 text-center font-mono text-sm text-on-surface-variant">
            LOADING ORDER HISTORY TICKETS...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 border-2 border-dashed border-outline text-center clip-zigzag max-w-md mx-auto">
            <Receipt className="w-12 h-12 text-outline mx-auto mb-2" />
            <h3 className="font-display text-xl font-bold uppercase mb-1">NO PAST ORDERS</h3>
            <p className="font-mono text-xs text-on-surface-variant mb-4">You have not placed any food order tickets yet.</p>
            <Link to="/" className="font-display text-xs uppercase bg-primary text-white px-4 py-2 font-bold inline-block">
              START ORDERING
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((ord) => (
              <TicketCard key={ord._id || ord.orderNumber} status={ord.status} className="p-6">
                <div className="flex justify-between items-start mb-4 pr-24">
                  <div>
                    <span className="font-mono text-xs text-on-surface-variant uppercase font-bold">
                      ORDER #{ord.orderNumber}
                    </span>
                    <h2 className="font-display text-2xl font-bold uppercase text-primary">
                      {ord.restaurantId?.name || ord.restaurantName || 'THE ORDER TICKET'}
                    </h2>
                    <p className="font-mono text-xs text-outline mt-0.5">
                      {new Date(ord.placedAt || ord.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Scissors Divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="w-full border-t border-dashed border-outline-variant"></div>
                  <span className="absolute bg-white px-2 text-outline text-[10px]">
                    <Scissors className="w-3 h-3 rotate-90" />
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-1.5 mb-4">
                  {ord.items.map((item, idx) => (
                    <PriceLine
                      key={idx}
                      qty={item.quantity}
                      item={item.name}
                      price={(item.price || 0) * item.quantity}
                    />
                  ))}
                </div>

                <div className="border-t-2 border-primary pt-3 flex flex-wrap justify-between items-center gap-4">
                  <div className="font-mono text-sm font-bold text-primary">
                    TOTAL PAID: ₹{(ord.total || 0).toFixed(2)}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReorder(ord)}
                      className="bg-secondary-container text-on-secondary-container border-2 border-primary px-4 py-2 font-display text-xs uppercase font-bold hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> REORDER
                    </button>
                    <button
                      onClick={() => navigate(`/orders/${ord._id || ord.orderNumber}/receipt`)}
                      className="border-2 border-primary bg-surface-container-lowest text-primary px-4 py-2 font-display text-xs uppercase font-bold hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" /> VIEW RECEIPT
                    </button>
                  </div>
                </div>
              </TicketCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
