import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home, Scissors, Flame, ArrowRight, Check } from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PaymentMethodSelect from '../../components/ui/PaymentMethodSelect';
import PriceLine from '../../components/ui/PriceLine';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartItemsCount, subtotal, deliveryFee, taxes, discountAmount, total, clearCart, currentRestaurantId } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('123 Culinary Row, Station 4, Food District 90210');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      if (res.data.addresses && res.data.addresses.length > 0) {
        setAddresses(res.data.addresses);
        setSelectedAddress(res.data.addresses[0].fullAddress);
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItemsCount === 0) {
      setError('Your cart is empty');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const orderPayload = {
        restaurantId: currentRestaurantId || 'rest_001',
        items: cartItems,
        deliveryAddress: selectedAddress,
        paymentMethod: paymentMethod,
        subtotal,
        deliveryFee,
        tax: taxes,
        discount: discountAmount,
        total
      };

      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data.order;

      clearCart();
      navigate(`/order/${createdOrder._id || createdOrder.orderNumber}/confirmation`);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItemsCount === 0 && !submitting) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="bg-surface-container-lowest border-2 border-primary p-8 clip-zigzag max-w-md">
          <h2 className="font-display text-2xl font-bold uppercase mb-2">NO ITEMS IN CHECKOUT</h2>
          <p className="font-mono text-xs text-on-surface-variant mb-4">Please add items to cart before proceeding.</p>
          <Link to="/" className="font-display text-xs uppercase bg-primary text-white px-4 py-2 font-bold inline-block">
            GO TO DISCOVER
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low text-primary min-h-screen flex flex-col font-body">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-surface-container-lowest border-b-2 border-primary sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/cart')} className="p-1 hover:bg-surface-container-high border border-outline-variant">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-primary">CHECKOUT</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 font-display text-xs uppercase">
          <Link to="/cart" className="text-on-surface-variant hover:text-primary">Cart</Link>
          <span className="font-bold border-b-2 border-secondary-container pb-0.5">Checkout</span>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full gap-8 p-4 md:p-8 flex flex-col lg:flex-row">
        {/* Left Column: Process & Form */}
        <div className="flex-grow flex flex-col gap-6 w-full lg:w-2/3">
          {/* Progress Tracker */}
          <div className="flex justify-between items-center border-b-2 border-primary pb-4 font-display text-xs uppercase tracking-wider relative">
            <div className="flex items-center gap-2 z-10 bg-surface-container-low pr-3">
              <div className="w-5 h-5 bg-secondary-container border-2 border-primary flex items-center justify-center font-bold">
                <Check className="w-3 h-3 text-primary stroke-[3]" />
              </div>
              <span>1. ADDRESS</span>
            </div>
            <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-outline-variant z-0"></div>
            <div className="flex items-center gap-2 z-10 bg-surface-container-low px-3">
              <div className="w-5 h-5 bg-primary text-white border-2 border-primary flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold border-b-2 border-primary">2. PAYMENT</span>
            </div>
            <div className="flex items-center gap-2 z-10 bg-surface-container-low pl-3 text-on-surface-variant">
              <div className="w-5 h-5 bg-surface-container-low border-2 border-outline-variant flex items-center justify-center">
                3
              </div>
              <span>3. CONFIRM</span>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container border border-error p-3 font-mono text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Section 1: Address */}
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-bold uppercase text-primary">DELIVERY ADDRESS</h2>
            <div className="bg-surface-container-lowest border-2 border-primary p-4 flex justify-between items-start clip-zigzag">
              <div className="flex gap-3">
                <Home className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold font-body text-sm text-primary">{user?.name} — Delivery Location</p>
                  <p className="text-on-surface-variant font-mono text-xs mt-1">
                    {selectedAddress}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="flex items-center justify-center my-2 text-outline font-mono text-xs uppercase tracking-widest gap-4">
            <Scissors className="w-4 h-4 rotate-90" />
            <span>— PAYMENT DETAILS —</span>
            <Scissors className="w-4 h-4 rotate-90" />
          </div>

          {/* Section 2: Payment Method Select */}
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-bold uppercase text-primary">PAYMENT METHOD</h2>
            <PaymentMethodSelect
              selectedMethod={paymentMethod}
              onChange={(m) => setPaymentMethod(m)}
            />
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-24 h-max">
          <div className="bg-surface-container-lowest border-2 border-primary clip-zigzag p-6 relative">
            <div className="absolute -top-3 -right-2 bg-primary text-secondary-container px-3 py-1 font-display text-xs uppercase font-bold border-2 border-primary clip-luggage-tag">
              FINAL RECAP
            </div>

            <h2 className="font-display text-xl font-bold uppercase border-b-2 border-primary pb-2 mb-4 text-primary">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item, i) => (
                <PriceLine
                  key={i}
                  qty={item.quantity}
                  item={item.dish.name}
                  price={(item.dish.price + (item.selectedAddOns || []).reduce((s, a) => s + (a.price || 0), 0)) * item.quantity}
                />
              ))}
            </div>

            <div className="border-t border-dashed border-outline-variant pt-3 space-y-1 font-mono text-xs text-right">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-herb-green font-bold">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-primary flex justify-between items-end font-bold font-mono text-base">
              <span>TOTAL DUE</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="button"
            disabled={submitting}
            onClick={handlePlaceOrder}
            className="w-full bg-secondary-container text-on-secondary-container border-2 border-primary py-4 px-6 font-display text-lg font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex justify-center items-center gap-3 relative clip-luggage-tag shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Flame className="w-5 h-5 text-error animate-bounce fill-error" />
                <span>PLACING ORDER…</span>
              </>
            ) : (
              <>
                <span>PLACE ORDER — ₹{total.toFixed(2)}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
