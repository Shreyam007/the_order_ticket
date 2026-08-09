import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('order_ticket_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  useEffect(() => {
    try {
      sessionStorage.setItem('order_ticket_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  const addToCart = (dish, quantity = 1, selectedAddOns = [], specialInstructions = '') => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.dish._id === dish._id &&
          JSON.stringify(item.selectedAddOns || []) === JSON.stringify(selectedAddOns || [])
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          dish,
          quantity,
          selectedAddOns: selectedAddOns || [],
          specialInstructions: specialInstructions || '',
          priceAtAddition: dish.price
        }
      ];
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountAmount(0);
    setPromoError('');
    setPromoSuccess('');
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const addOnTotal = (item.selectedAddOns || []).reduce((sum, a) => sum + (a.price || 0), 0);
    return acc + (item.dish.price + addOnTotal) * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 500 || promoCode === 'FREESHIP' || cartItems.length === 0 ? 0 : 40;
  const taxes = Math.round(subtotal * 0.05);

  const applyPromoCode = (code) => {
    const upperCode = (code || '').trim().toUpperCase();
    setPromoError('');
    setPromoSuccess('');

    if (!upperCode) {
      setPromoError('Please enter a promo code.');
      return;
    }

    if (upperCode === 'KITCHEN10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setPromoCode('KITCHEN10');
      setPromoSuccess('10% OFF applied successfully!');
    } else if (upperCode === 'FREESHIP') {
      setDiscountAmount(0);
      setPromoCode('FREESHIP');
      setPromoSuccess('FREE SHIPPING applied successfully!');
    } else if (upperCode === 'TICKET50') {
      const disc = Math.min(50, subtotal);
      setDiscountAmount(disc);
      setPromoCode('TICKET50');
      setPromoSuccess('₹50 OFF applied successfully!');
    } else {
      setPromoError('Invalid promo code. Try KITCHEN10, FREESHIP, or TICKET50.');
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountAmount(0);
    setPromoError('');
    setPromoSuccess('');
  };

  const total = Math.max(0, subtotal + deliveryFee + taxes - discountAmount);

  // Restaurant details associated with current cart items
  const currentRestaurantId = cartItems.length > 0 ? cartItems[0].dish.restaurantId : null;

  return (
    <CartContext.Provider
      value={{
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
        currentRestaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
