import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrderApi } from '../services/orderService';

const Checkout = () => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '123 Tech Boulevard, Suite 400',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const shippingCost = cartSubtotal > 99 ? 0 : 15.0;
  const taxCost = cartSubtotal * 0.08;
  const grandTotal = cartSubtotal + shippingCost + taxCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to place an order', 'error');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    setLoading(true);

    const formattedItems = cartItems.map((item) => {
      const prod = item.product || {};
      return {
        product: prod._id || item._id,
        title: prod.title || 'Product Item',
        price: prod.price || 0,
        quantity: item.quantity,
        image: prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      };
    });

    try {
      const res = await createOrderApi({
        items: formattedItems,
        totalPrice: Number(grandTotal.toFixed(2)),
        shippingAddress,
        paymentMethod,
      });

      if (res.success) {
        await clearCart();
        addToast('Order placed successfully!', 'success');
        navigate('/orders');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Checkout</h1>
        <p className="text-slate-400 text-sm mt-1">Complete your shipping and payment details</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Truck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">1. Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Postal Code</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <CreditCard className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">2. Payment Option</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <label
                  key={method}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === method
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <CreditCard className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs font-bold">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Preview Sidebar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl h-fit space-y-6">
          <h2 className="text-xl font-extrabold text-white pb-4 border-b border-slate-800">Summary</h2>

          <div className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs text-slate-300">
                <span className="line-clamp-1 flex-1 pr-2">{item.product?.title || 'Product'} (x{item.quantity})</span>
                <span className="font-semibold text-white">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="text-white font-semibold">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-white font-semibold">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="text-white font-semibold">${taxCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-white border-t border-slate-800">
              <span>Total Pay</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Place Order Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
