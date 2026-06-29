import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCartApi, addToCartApi, updateCartItemApi, removeFromCartApi } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!user) {
      // Local storage fallback for guest cart
      const guestCart = localStorage.getItem('mini_ecom_guest_cart');
      setCartItems(guestCart ? JSON.parse(guestCart) : []);
      return;
    }
    setLoading(true);
    try {
      const res = await getCartApi();
      if (res.success && res.data?.products) {
        setCartItems(res.data.products);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      // Guest cart logic
      setCartItems((prev) => {
        const existing = prev.find((item) => (item.product?._id || item.product) === product._id);
        let updated;
        if (existing) {
          updated = prev.map((item) =>
            (item.product?._id || item.product) === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updated = [...prev, { _id: 'guest_' + Date.now(), product, quantity }];
        }
        localStorage.setItem('mini_ecom_guest_cart', JSON.stringify(updated));
        return updated;
      });
      addToast(`Added "${product.title}" to cart`, 'success');
      return;
    }

    try {
      const res = await addToCartApi(product._id, quantity);
      if (res.success) {
        setCartItems(res.data.products);
        addToast(`Added "${product.title}" to cart`, 'success');
      }
    } catch (error) {
      addToast('Could not add item to cart', 'error');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);

    if (!user) {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          (item.product?._id || item.product) === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('mini_ecom_guest_cart', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const res = await updateCartItemApi(productId, quantity);
      if (res.success) {
        setCartItems(res.data.products);
      }
    } catch (error) {
      addToast('Could not update quantity', 'error');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      setCartItems((prev) => {
        const updated = prev.filter((item) => (item.product?._id || item.product) !== productId);
        localStorage.setItem('mini_ecom_guest_cart', JSON.stringify(updated));
        return updated;
      });
      addToast('Item removed from cart', 'info');
      return;
    }

    try {
      const res = await removeFromCartApi(productId);
      if (res.success) {
        setCartItems(res.data.products);
        addToast('Item removed from cart', 'info');
      }
    } catch (error) {
      addToast('Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    if (!user) {
      setCartItems([]);
      localStorage.removeItem('mini_ecom_guest_cart');
      return;
    }
    try {
      await removeFromCartApi('clear');
      setCartItems([]);
    } catch (error) {
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
