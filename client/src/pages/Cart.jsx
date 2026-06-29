import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import EmptyCart from '../components/EmptyCart';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  const shippingCost = cartSubtotal > 99 ? 0 : 15.0;
  const taxCost = cartSubtotal * 0.08;
  const grandTotal = cartSubtotal + shippingCost + taxCost;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Your Shopping Cart</h1>
          <p className="text-slate-400 text-sm mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const prod = item.product || {};
            const itemPrice = prod.price || 0;
            const itemId = prod._id || item._id;

            return (
              <div
                key={item._id}
                className="glass-card p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <img
                  src={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                  alt={prod.title}
                  className="w-24 h-24 object-cover rounded-xl bg-slate-900 shrink-0"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{prod.category}</span>
                  <h3 className="font-bold text-white text-base line-clamp-1">{prod.title}</h3>
                  <p className="text-indigo-300 font-extrabold text-lg">${Number(itemPrice).toFixed(2)}</p>
                </div>

                {/* Quantity & Delete */}
                <div className="flex items-center gap-6 sm:gap-4">
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity - 1)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity + 1)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl h-fit space-y-6">
          <h2 className="text-xl font-extrabold text-white pb-4 border-b border-slate-800">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-white">
                {shippingCost === 0 ? <span className="text-emerald-400">FREE</span> : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-white">${taxCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-base font-bold text-white">Grand Total</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
