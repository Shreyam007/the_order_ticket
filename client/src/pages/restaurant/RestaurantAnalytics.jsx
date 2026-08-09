import React, { useState, useEffect } from 'react';
import { Star, Flame, Calendar, BarChart2, Scissors, Award } from 'lucide-react';
import api from '../../api/client';
import { useSSE } from '../../hooks/useSSE';
import SideNavBar from '../../components/ui/SideNavBar';

export default function RestaurantAnalytics() {
  const { lastEvent } = useSSE();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'review:new') {
      const newReview = lastEvent.data;
      setData((prev) =>
        prev
          ? { ...prev, recentReviews: [newReview, ...(prev.recentReviews || []).slice(0, 9)] }
          : prev
      );
    }
  }, [lastEvent]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurants/my-restaurant/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const analytics = data || {
    totalRevenue: 432950,
    totalOrdersCount: 1284,
    avgRating: 4.8,
    avgPrepTime: '8m 12s',
    topItems: [
      { name: 'Double Smashburger', count: 142, percentage: 85 },
      { name: 'Truffle Fries', count: 118, percentage: 65 },
      { name: 'Vanilla Shake', count: 95, percentage: 45 }
    ],
    recentReviews: [
      {
        _id: 'r1',
        customerName: 'John D.',
        rating: 5,
        text: 'Best smashburger in town. The truffle fries were perfectly crispy and arrived hot.',
        createdAt: new Date()
      }
    ]
  };

  return (
    <div className="bg-surface-container-low text-primary font-body min-h-screen flex overflow-hidden">
      <SideNavBar />

      <main className="md:ml-64 flex-1 h-screen flex flex-col overflow-y-auto p-6 pb-20">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-primary pb-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase text-primary tracking-tight">
              RESTAURANT ANALYTICS
            </h1>
            <p className="font-mono text-xs text-on-surface-variant">REAL-TIME KITCHEN PERFORMANCE OVERVIEW</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center border border-primary bg-surface-container-lowest font-mono text-xs">
            <div className="px-3 py-2 border-r border-primary bg-surface-container-high">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="px-3 py-2 font-bold text-primary">OCT 1 - OCT 31</div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container-lowest border-2 border-primary p-4 border-t-4 border-t-secondary-container">
            <span className="font-display text-xs font-bold uppercase text-on-surface-variant block mb-1">
              TOTAL ORDERS
            </span>
            <span className="font-display text-3xl font-bold text-primary">{analytics.totalOrdersCount}</span>
          </div>

          <div className="bg-surface-container-lowest border-2 border-primary p-4 border-t-4 border-t-secondary-container">
            <span className="font-display text-xs font-bold uppercase text-on-surface-variant block mb-1">
              REVENUE
            </span>
            <span className="font-display text-3xl font-bold text-primary">
              ₹{analytics.totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="bg-surface-container-lowest border-2 border-primary p-4 border-t-4 border-t-primary">
            <span className="font-display text-xs font-bold uppercase text-on-surface-variant block mb-1">
              AVG PREP TIME
            </span>
            <span className="font-display text-3xl font-bold text-primary">{analytics.avgPrepTime}</span>
          </div>

          <div className="bg-surface-container-lowest border-2 border-primary p-4 border-t-4 border-t-herb-green">
            <span className="font-display text-xs font-bold uppercase text-on-surface-variant block mb-1">
              AVG RATING
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-bold text-primary">{analytics.avgRating}</span>
              <Star className="w-6 h-6 fill-secondary-container text-secondary" />
            </div>
          </div>
        </div>

        {/* Analytics Charts & Top Selling Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders Bar Visual */}
          <div className="bg-surface-container-lowest border-2 border-primary p-6 clip-zigzag">
            <div className="flex justify-between items-center border-b-2 border-primary pb-2 mb-4">
              <h3 className="font-display text-lg font-bold uppercase text-primary flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" /> ORDERS OVER TIME
              </h3>
            </div>
            <div className="h-48 flex items-end justify-between gap-2 pt-4">
              {[40, 65, 35, 80, 50, 75, 90, 60, 85, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-secondary-container border border-primary group-hover:bg-primary transition-colors"
                  ></div>
                  <span className="font-mono text-[9px] text-outline">#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Items Breakdown */}
          <div className="bg-surface-container-lowest border-2 border-primary p-6 clip-zigzag">
            <div className="flex justify-between items-center border-b-2 border-primary pb-2 mb-4">
              <h3 className="font-display text-lg font-bold uppercase text-primary flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> TOP-SELLING DISHES
              </h3>
            </div>

            <div className="space-y-4">
              {analytics.topItems.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs font-bold text-primary">
                    <span>{item.name}</span>
                    <span>{item.count} ORDERS</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-low border border-primary">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className="h-full bg-secondary-container border-r border-primary"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews Feed */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t-2 border-dashed border-outline-variant"></div>
          <span className="absolute bg-surface-container-low px-4 font-display text-xs font-bold uppercase text-outline flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5 rotate-90" /> RECENT REVIEWS FEED
          </span>
        </div>

        <div className="space-y-3">
          {analytics.recentReviews.map((rev, idx) => (
            <div key={rev._id || idx} className="bg-surface-container-lowest border-2 border-primary p-4 clip-zigzag">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-display text-base font-bold text-primary">
                    {rev.customerId?.name || rev.customerName || 'Customer'}
                  </h4>
                  <div className="flex gap-0.5 text-secondary mt-0.5">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-secondary-container text-secondary" />
                    ))}
                  </div>
                </div>
                <span className="font-mono text-xs text-outline">
                  {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              {rev.text && <p className="font-mono text-xs text-primary">{rev.text}</p>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
