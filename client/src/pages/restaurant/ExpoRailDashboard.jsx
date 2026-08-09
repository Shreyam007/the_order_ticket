import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, Check, Power, Scissors } from 'lucide-react';
import api from '../../api/client';
import { useSSE } from '../../hooks/useSSE';
import SideNavBar from '../../components/ui/SideNavBar';
import TicketCard from '../../components/ui/TicketCard';

export default function ExpoRailDashboard() {
  const { lastEvent } = useSSE();
  const [orders, setOrders] = useState([]);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpoOrders();
  }, []);

  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.type === 'order:created') {
        const newOrder = lastEvent.data;
        setOrders((prev) => [newOrder, ...prev.filter((o) => (o._id || o.orderNumber) !== (newOrder._id || newOrder.orderNumber))]);
      } else if (lastEvent.type === 'order:statusChanged') {
        const { orderId, status } = lastEvent.data;
        setOrders((prev) =>
          prev.map((o) => ((o._id || o.orderNumber) === orderId ? { ...o, status } : o))
        );
      }
    }
  }, [lastEvent]);

  const fetchExpoOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurants/my-restaurant/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching expo orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleKitchen = async () => {
    try {
      const res = await api.patch('/restaurants/my-restaurant/toggle-open');
      setIsKitchenOpen(res.data.isOpen);
    } catch (err) {
      console.error('Error toggling kitchen:', err);
      setIsKitchenOpen(!isKitchenOpen);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Optimistic state update
      setOrders((prev) =>
        prev.map((o) => ((o._id || o.orderNumber) === orderId ? { ...o, status: newStatus } : o))
      );
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
    } catch (err) {
      console.error('Error updating order status:', err);
      fetchExpoOrders();
    }
  };

  const newOrders = orders.filter((o) => o.status === 'fired' || o.status === 'new');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready' || o.status === 'out_for_delivery');

  return (
    <div className="bg-surface-container-low text-primary font-body min-h-screen flex overflow-hidden">
      <SideNavBar />

      <main className="md:ml-64 flex-1 h-screen flex flex-col overflow-hidden relative">
        {/* Top App Header */}
        <header className="flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b-2 border-primary shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-primary">
              EXPO RAIL KITCHEN DASHBOARD
            </h2>
            <span className="font-mono text-xs text-on-surface-variant hidden sm:inline">
              Station 01 · Real-Time SSE Stream Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Kitchen Status Toggle */}
            <button
              onClick={handleToggleKitchen}
              className={`flex items-center gap-2 px-3 py-1.5 border-2 border-primary font-display text-xs uppercase font-bold transition-colors ${
                isKitchenOpen
                  ? 'bg-herb-green text-white'
                  : 'bg-error text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isKitchenOpen ? 'KITCHEN OPEN' : 'KITCHEN CLOSED'}</span>
            </button>
          </div>
        </header>

        {/* Stat Bar */}
        <div className="grid grid-cols-4 border-b-2 border-primary shrink-0 bg-surface-container-lowest font-mono text-xs">
          <div className="p-3 border-r-2 border-primary border-t-4 border-t-secondary-container">
            <span className="text-on-surface-variant uppercase font-bold block mb-0.5">NEW TICKETS</span>
            <span className="font-display text-2xl font-bold text-primary">{newOrders.length}</span>
          </div>
          <div className="p-3 border-r-2 border-primary border-t-4 border-t-secondary-container">
            <span className="text-on-surface-variant uppercase font-bold block mb-0.5">PREPARING</span>
            <span className="font-display text-2xl font-bold text-primary">{preparingOrders.length}</span>
          </div>
          <div className="p-3 border-r-2 border-primary border-t-4 border-t-herb-green">
            <span className="text-on-surface-variant uppercase font-bold block mb-0.5">READY FOR PICKUP</span>
            <span className="font-display text-2xl font-bold text-primary">{readyOrders.length}</span>
          </div>
          <div className="p-3 border-t-4 border-t-primary">
            <span className="text-on-surface-variant uppercase font-bold block mb-0.5">AVG PREP TIME</span>
            <span className="font-display text-2xl font-bold text-primary">8m 12s</span>
          </div>
        </div>

        {/* Kanban Expo Columns */}
        <div className="flex-1 overflow-x-auto flex p-6 gap-6 bg-surface-container-low">
          {/* Column 1: NEW / FIRED */}
          <section className="shrink-0 w-80 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b-2 border-primary pb-2">
              <h3 className="font-display text-lg font-bold text-primary uppercase flex items-center gap-2">
                <Flame className="w-5 h-5 text-secondary-container fill-secondary-container" />
                <span>1. NEW / FIRED</span>
              </h3>
              <span className="bg-primary text-white font-mono text-xs font-bold px-2 py-0.5">
                {newOrders.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-20">
              {newOrders.map((ord) => (
                <TicketCard key={ord._id || ord.orderNumber} status="fired" className="p-4">
                  <div className="flex justify-between items-start mb-2 pr-20">
                    <h4 className="font-display text-xl font-bold text-primary">
                      #{ord.orderNumber}
                    </h4>
                  </div>

                  <div className="font-mono text-xs space-y-1 mb-3">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>×{item.quantity} {item.name}</span>
                        {item.specialInstructions && (
                          <span className="text-error font-bold text-[10px] block">
                            Note: {item.specialInstructions}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-outline-variant pt-2 mb-3 font-mono text-[11px] text-on-surface-variant">
                    Total Due: ₹{(ord.total || 0).toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(ord._id || ord.orderNumber, 'preparing')}
                    className="w-full bg-secondary-container text-on-secondary-container border-2 border-primary font-display text-xs font-bold uppercase py-2.5 hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <span>START PREPARING</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </TicketCard>
              ))}
            </div>
          </section>

          {/* Column 2: PREPARING */}
          <section className="shrink-0 w-80 flex flex-col gap-4 border-l-2 border-dashed border-outline-variant pl-6">
            <div className="flex justify-between items-center border-b-2 border-primary pb-2">
              <h3 className="font-display text-lg font-bold text-primary uppercase">
                2. PREPARING
              </h3>
              <span className="bg-primary text-white font-mono text-xs font-bold px-2 py-0.5">
                {preparingOrders.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-20">
              {preparingOrders.map((ord) => (
                <TicketCard key={ord._id || ord.orderNumber} status="preparing" className="p-4">
                  <div className="flex justify-between items-start mb-2 pr-20">
                    <h4 className="font-display text-xl font-bold text-primary">
                      #{ord.orderNumber}
                    </h4>
                  </div>

                  <div className="font-mono text-xs space-y-1 mb-3">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>×{item.quantity} {item.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(ord._id || ord.orderNumber, 'ready')}
                    className="w-full bg-herb-green text-white border-2 border-primary font-display text-xs font-bold uppercase py-2.5 hover:bg-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <span>MARK READY</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </TicketCard>
              ))}
            </div>
          </section>

          {/* Column 3: READY / HANDED TO RIDER */}
          <section className="shrink-0 w-80 flex flex-col gap-4 border-l-2 border-dashed border-outline-variant pl-6">
            <div className="flex justify-between items-center border-b-2 border-primary pb-2">
              <h3 className="font-display text-lg font-bold text-primary uppercase">
                3. READY FOR PICKUP
              </h3>
              <span className="bg-primary text-white font-mono text-xs font-bold px-2 py-0.5">
                {readyOrders.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-20">
              {readyOrders.map((ord) => (
                <TicketCard key={ord._id || ord.orderNumber} status="ready" className="p-4 opacity-90">
                  <div className="flex justify-between items-start mb-2 pr-20">
                    <h4 className="font-display text-xl font-bold text-primary">
                      #{ord.orderNumber}
                    </h4>
                  </div>

                  <div className="font-mono text-xs mb-3">
                    <span className="text-herb-green font-bold">✓ Packaged & Ready</span>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(ord._id || ord.orderNumber, 'out_for_delivery')}
                    className="w-full bg-surface-container-high text-primary border-2 border-primary font-display text-xs font-bold uppercase py-2.5 hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <span>HAND TO RIDER</span>
                  </button>
                </TicketCard>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
