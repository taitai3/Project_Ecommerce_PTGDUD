import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { isAuthenticated } from '../utils/auth';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated()) {
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data || { items: [], totalAmount: 0, totalItems: 0 });
    } catch (err) {
      console.error('fetchCart error:', err?.response?.status, err?.response?.data);
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Re-fetch cart when localStorage token changes (after login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchCart();
    };
    window.addEventListener('storage', handleStorageChange);
    // Also poll every 500ms for same-tab token changes (login doesn't trigger storage event)
    const interval = setInterval(() => {
      const hasToken = !!localStorage.getItem('token');
      const hasItems = (cart?.items?.length || 0) > 0;
      // If we have a token but no items loaded yet, try fetching
      if (hasToken && !hasItems && !loading) {
        fetchCart();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchCart, cart, loading]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated()) return false;
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      // Update cart directly from response instead of re-fetching
      if (res.data) {
        setCart(res.data);
      } else {
        await fetchCart();
      }
      return true;
    } catch (err) {
      console.error('addToCart error:', err?.response?.status, err?.response?.data);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      if (res.data) {
        setCart(res.data);
      } else {
        await fetchCart();
      }
    } catch (err) {
      console.error('updateCartItem error:', err?.response?.status, err?.response?.data);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error('removeCartItem error:', err?.response?.status, err?.response?.data);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } catch (err) {
      console.error('clearCart error:', err?.response?.status, err?.response?.data);
    }
  };

  const totalItems = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateCartItem, removeCartItem, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
