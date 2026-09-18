import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const STORAGE_KEY = 'cb_cart';

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, size = 'Standard') => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        const newItem = {
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || '/images/01.jpeg',
          category: product.categoryName || product.category,
          size,
          quantity
        };
        return [...prev, newItem];
      }
    });

    addToast(`Added ${quantity}x "${product.title}" to cart!`, 'success', 'Added to Cart');
  };

  const updateQuantity = (id, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (id, size) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    addToast('Item removed from your cart.', 'info');
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'CEYLON10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      addToast('Promo code CEYLON10 applied (10% OFF)!', 'success');
      return true;
    } else if (clean === 'BATIK20') {
      setCouponCode(clean);
      setDiscountPercent(20);
      addToast('VIP Promo BATIK20 applied (20% OFF)!', 'success');
      return true;
    } else {
      addToast('Invalid or expired coupon code. Try "CEYLON10"', 'error');
      return false;
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 450;
  const total = subtotal - discountAmount + shipping;
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        discountPercent,
        discountAmount,
        applyCoupon,
        subtotal,
        shipping,
        total,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
