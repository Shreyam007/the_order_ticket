import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Scissors, Trash2, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import QtyStepper from '../../components/ui/QtyStepper';
import PriceLine from '../../components/ui/PriceLine';

export default function Cart() {
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const {
    cartItems,
    cartItemsCount,
    subtotal,
    deliveryFee,
    taxes,
    discountAmount,
    total,
    promoCode,
    promoError,
    promoSuccess,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    clearCart
  } = useCart();

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    applyPromoCode(promoInput);
  };

  if (cartItemsCount === 0) {
    return (
      <div className="bg-surface-container-low min-h-screen py-16 px-4 flex flex-col items-center justify-center font-body text-on-surface">
        <div className="max-w-md w-full bg-surface-container-lowest border-2 border-primary clip-zigzag p-8 text-center">
          <ShoppingBag className="w-12 h-12 text-outline mx-auto mb-3" />
          <h2 className="font-display text-3xl font-bold uppercase text-primary mb-2">
            YOUR TICKET IS EMPTY
          </h2>
          <p className="font-mono text-xs text-on-surface-variant mb-6">
            You have no items in your order ticket. Browse kitchen menus to add dishes.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container border-2 border-primary px-6 py-3 font-display text-sm font-bold uppercase hover:bg-primary hover:text-white transition-colors clip-luggage-tag"
          >
            <span>DISCOVER KITCHENS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low min-h-screen font-body text-on-surface">
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        {/* Header */}
        <header className="flex justify-between items-end border-b-2 border-primary pb-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase text-primary tracking-tight">
              CURRENT ORDER
            </h1>
            <p className="font-mono text-xs text-on-surface-variant">REVIEW ITEMS BEFORE FULFILLMENT</p>
          </div>
          <div className="font-mono text-sm font-bold text-primary bg-surface-container-lowest px-3 py-1 border border-outline-variant">
            TICKET #{(Math.random() * 9000 + 1000).toFixed(0)}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Receipt Area */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest border-2 border-primary clip-zigzag pb-8 mb-6 p-6">
              {/* Header Ticket Info */}
              <div className="flex justify-between items-center border-b-2 border-primary pb-4 mb-6 font-mono text-xs text-primary font-bold">
                <div>EXPO: <span className="text-secondary font-bold">STATION A</span></div>
                <div>ITEMS: <span className="text-secondary font-bold">{cartItemsCount}</span></div>
                <button
                  onClick={clearCart}
                  className="text-error hover:underline text-xs font-mono uppercase"
                >
                  CLEAR TICKET
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {cartItems.map((item, idx) => {
                  const addOnsList = (item.selectedAddOns || []).map(
                    (a) => `${a.name} (+₹${a.price})`
                  );
                  const itemPriceTotal =
                    (item.dish.price +
                      (item.selectedAddOns || []).reduce((sum, a) => sum + (a.price || 0), 0)) *
                    item.quantity;

                  return (
                    <div key={idx} className="pb-4 border-b border-dashed border-outline-variant last:border-b-0">
                      <PriceLine
                        qty={item.quantity}
                        item={item.dish.name}
                        addOns={addOnsList}
                        price={itemPriceTotal}
                        className="mb-2"
                      />

                      {item.specialInstructions && (
                        <p className="font-mono text-xs text-secondary italic pl-6 mb-2">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}

                      <div className="flex items-center gap-4 pl-6 mt-2">
                        <QtyStepper
                          value={item.quantity}
                          onChange={(newQty) => updateQuantity(idx, newQty)}
                        />
                        <button
                          type="button"
                          onClick={() => removeFromCart(idx)}
                          className="font-mono text-xs text-error uppercase font-bold hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scissors Divider */}
              <div className="relative flex items-center justify-center my-8">
                <div className="w-full border-t-2 border-dashed border-primary"></div>
                <span className="absolute bg-white px-4 font-mono text-xs font-bold text-primary flex items-center gap-2">
                  <Scissors className="w-4 h-4 rotate-90 text-primary" />
                  ORDER TOTALS
                </span>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 font-mono text-sm text-right w-full flex flex-col items-end">
                <div className="w-72 flex justify-between">
                  <span className="text-on-surface-variant">SUBTOTAL</span>
                  <span className="font-bold text-primary">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="w-72 flex justify-between">
                  <span className="text-on-surface-variant">DELIVERY FEE</span>
                  <span className="font-bold text-primary">
                    {deliveryFee === 0 ? (
                      <span className="text-herb-green font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="w-72 flex justify-between">
                  <span className="text-on-surface-variant">TAXES & PACKAGING (5%)</span>
                  <span className="font-bold text-primary">₹{taxes.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="w-72 flex justify-between text-herb-green font-bold">
                    <span>PROMO DISCOUNT ({promoCode})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="w-72 flex justify-between border-t-4 border-primary pt-3 mt-2 font-bold text-lg text-primary">
                  <span>TOTAL</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Field */}
              <form onSubmit={handlePromoSubmit} className="mt-8">
                <div className="flex font-mono">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="ENTER PROMO CODE (e.g. KITCHEN10)"
                    className="flex-grow border-2 border-primary border-r-0 px-4 py-2.5 bg-surface-container-lowest placeholder:text-outline text-primary uppercase font-bold outline-none text-xs"
                  />
                  <button
                    type="submit"
                    className="border-2 border-primary px-6 font-bold hover:bg-primary hover:text-white transition-colors uppercase bg-secondary-container text-on-secondary-container font-display text-sm"
                  >
                    APPLY
                  </button>
                </div>

                {/* Promo Code Helpers */}
                <div className="mt-2 flex flex-wrap gap-2 items-center text-xs font-mono text-on-surface-variant">
                  <span>TEST CODES:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPromoInput('KITCHEN10');
                      applyPromoCode('KITCHEN10');
                    }}
                    className="px-2 py-0.5 border border-outline-variant bg-surface-container-high hover:border-primary font-bold"
                  >
                    KITCHEN10 (10% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPromoInput('FREESHIP');
                      applyPromoCode('FREESHIP');
                    }}
                    className="px-2 py-0.5 border border-outline-variant bg-surface-container-high hover:border-primary font-bold"
                  >
                    FREESHIP (Free Delivery)
                  </button>
                </div>

                {promoError && (
                  <p className="font-mono text-xs text-error mt-2">⚠️ {promoError}</p>
                )}
                {promoSuccess && (
                  <p className="font-mono text-xs text-herb-green mt-2 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {promoSuccess}
                    <button type="button" onClick={removePromoCode} className="ml-2 text-error underline text-[10px]">
                      Remove
                    </button>
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar / Checkout CTA Area */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border-2 border-primary p-5 bg-surface-container-lowest clip-zigzag">
              <div className="font-display text-xs font-bold text-on-surface-variant uppercase mb-1">
                FULFILLMENT LOCATION
              </div>
              <div className="font-display text-xl font-bold text-primary uppercase">
                THE EXPO KITCHEN
              </div>
              <p className="font-mono text-xs text-on-surface-variant mt-2">
                124 Kitchen St, Terminal 4
              </p>
            </div>

            <div className="border-2 border-primary bg-secondary-container text-on-secondary-container p-4 font-mono text-xs font-bold uppercase tracking-wider text-center clip-luggage-tag">
              DELIVERY ESTIMATE: 25-35 MINS
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-secondary-container border-2 border-primary py-4 hover:bg-primary hover:text-white transition-colors group flex items-center justify-center gap-2 font-display text-xl font-bold uppercase text-on-secondary-container clip-luggage-tag shadow-md"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
