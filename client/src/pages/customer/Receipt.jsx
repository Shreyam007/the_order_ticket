import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Flame, Scissors, CheckCircle2, ArrowRight, Download, RefreshCw } from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import PriceLine from '../../components/ui/PriceLine';

export default function Receipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [foodQuality, setFoodQuality] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceiptData();
  }, [id]);

  const fetchReceiptData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);

      // Check existing review
      try {
        const revRes = await api.get(`/reviews/order/${id}`);
        if (revRes.data.review) {
          setReview(revRes.data.review);
        }
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching receipt details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (review) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        orderId: id,
        restaurantId: order?.restaurantId?._id || order?.restaurantId,
        rating,
        foodQuality,
        text: reviewText
      });
      setReview(res.data.review);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReorder = () => {
    if (!order) return;
    clearCart();
    order.items.forEach((item) => {
      addToCart(
        {
          _id: item.dishId || 'dish_reorder',
          name: item.name,
          price: item.price,
          restaurantId: order.restaurantId?._id || order.restaurantId
        },
        item.quantity,
        item.selectedAddOns || [],
        item.specialInstructions || ''
      );
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center font-mono text-sm text-on-surface-variant">
        LOADING ITEMISED RECEIPT TICKET...
      </div>
    );
  }

  const displayOrder = order || {
    orderNumber: id.startsWith('FT-') ? id : 'FT-8841',
    restaurantName: 'THE BURGER JOINT',
    placedAt: new Date(),
    deliveryAddress: '123 Culinary Row, Station 4',
    items: [
      { name: 'Classic Cheeseburger', quantity: 2, price: 450 },
      { name: 'Truffle Fries', quantity: 1, price: 220 }
    ],
    subtotal: 1120,
    deliveryFee: 40,
    tax: 56,
    total: 1216
  };

  return (
    <div className="bg-surface-container-low text-primary min-h-screen flex flex-col font-body pb-16">
      <main className="flex-grow pt-8 px-4 max-w-3xl mx-auto w-full flex flex-col gap-6">
        {/* Action Header */}
        <div className="flex justify-between items-end w-full">
          <h1 className="font-display text-3xl font-bold uppercase text-primary">RECEIPT DETAILS</h1>
          <div className="flex gap-3">
            <button
              onClick={handleReorder}
              className="bg-secondary-container text-on-secondary-container border-2 border-primary px-4 py-2 font-display text-xs uppercase font-bold hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> REORDER
            </button>
          </div>
        </div>

        {/* The Thermal Receipt Card */}
        <article className="bg-surface-container-lowest w-full border-2 border-primary relative clip-zigzag p-6 md:p-8 shadow-md">
          {/* Fulfilled Tag */}
          <div className="absolute -top-3 -right-2 bg-herb-green text-white border-2 border-primary px-3 py-1 font-display text-xs uppercase font-bold clip-luggage-tag flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> FULFILLED
          </div>

          {/* Header Info */}
          <header className="text-center border-b-2 border-dashed border-outline-variant pb-4 mb-4">
            <h2 className="font-display text-3xl font-bold uppercase text-primary tracking-tight">
              {displayOrder.restaurantId?.name || displayOrder.restaurantName || 'THE ORDER TICKET'}
            </h2>
            <div className="font-mono text-xs text-on-surface-variant mt-1 space-y-0.5">
              <p>123 CULINARY ROW, STATION 4</p>
              <p>SUPPORT@THEORDERTICKET.COM</p>
            </div>
          </header>

          {/* Order Meta */}
          <div className="flex justify-between font-mono text-xs font-bold text-primary mb-4">
            <span>ORDER #{displayOrder.orderNumber}</span>
            <span>{new Date(displayOrder.placedAt || Date.now()).toLocaleString()}</span>
          </div>

          {/* Scissors Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-dashed border-outline-variant"></div>
            <span className="absolute bg-white px-3 font-mono text-xs text-outline flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 rotate-90" /> ITEMS
            </span>
          </div>

          {/* Itemized List */}
          <div className="space-y-2 mb-6">
            {displayOrder.items.map((item, idx) => (
              <PriceLine
                key={idx}
                qty={item.quantity}
                item={item.name}
                price={(item.price || 0) * item.quantity}
              />
            ))}
          </div>

          {/* Scissors Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-dashed border-outline-variant"></div>
            <span className="absolute bg-white px-3 font-mono text-xs text-outline flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 rotate-90" /> TOTALS
            </span>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-1.5 font-mono text-xs text-right w-full flex flex-col items-end">
            <div className="w-64 flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>₹{(displayOrder.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="w-64 flex justify-between">
              <span className="text-on-surface-variant">Delivery Fee</span>
              <span>₹{(displayOrder.deliveryFee || 0).toFixed(2)}</span>
            </div>
            <div className="w-64 flex justify-between">
              <span className="text-on-surface-variant">Taxes</span>
              <span>₹{(displayOrder.tax || 0).toFixed(2)}</span>
            </div>
            <div className="w-64 flex justify-between border-t-2 border-primary pt-2 mt-1 font-bold text-base text-primary">
              <span>TOTAL</span>
              <span>₹{(displayOrder.total || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Info */}
          <footer className="font-mono text-xs text-outline mt-6 pt-4 border-t border-dashed border-outline-variant">
            <p>Delivery Address: {displayOrder.deliveryAddress}</p>
            <p>Payment: {displayOrder.paymentMethod?.toUpperCase() || 'CARD'} (PAID)</p>
          </footer>
        </article>

        {/* Rate this Order Section */}
        <section className="bg-surface-container-lowest p-6 border-2 border-primary clip-zigzag">
          <h3 className="font-display text-xl font-bold uppercase text-primary border-b-2 border-primary pb-2 mb-4 inline-block">
            HOW WAS THE SERVICE & FOOD?
          </h3>

          {review ? (
            <div className="bg-surface-container p-4 border border-outline-variant font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-secondary">
                <span className="font-bold">YOUR RATING:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
              {review.text && <p className="text-primary italic">"{review.text}"</p>}
              <p className="text-herb-green font-bold">✓ Review submitted to kitchen analytics</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 justify-between">
                {/* Service Rating */}
                <div>
                  <label className="block font-display text-xs font-bold uppercase text-on-surface-variant mb-1">
                    OVERALL SERVICE RATING
                  </label>
                  <div className="flex gap-1 text-secondary cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-secondary-container text-secondary' : 'text-outline-variant'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Rating (Flames) */}
                <div>
                  <label className="block font-display text-xs font-bold uppercase text-on-surface-variant mb-1">
                    FLAME RATING (FOOD QUALITY)
                  </label>
                  <div className="flex gap-1 text-error cursor-pointer">
                    {[1, 2, 3, 4, 5].map((flame) => (
                      <button
                        key={flame}
                        type="button"
                        onClick={() => setFoodQuality(flame)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Flame
                          className={`w-6 h-6 ${
                            flame <= foodQuality ? 'fill-error text-error' : 'text-outline-variant'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-display text-xs font-bold uppercase text-on-surface-variant mb-1">
                  ADD A NOTE FOR THE KITCHEN
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Any specific feedback for the chef..."
                  className="w-full border border-outline-variant p-3 font-mono text-xs text-primary bg-surface-container-low outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-secondary-container text-on-secondary-container border-2 border-primary px-6 py-3 font-display text-sm font-bold uppercase hover:bg-primary hover:text-white transition-colors flex items-center gap-2 clip-luggage-tag"
              >
                <span>{submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
