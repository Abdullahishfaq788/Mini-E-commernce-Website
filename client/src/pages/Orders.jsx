import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { getOrdersApi } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

const statusStyles = {
  Pending: 'bg-amber-950/80 text-amber-300 border-amber-500/40 icon:Clock',
  Processing: 'bg-blue-950/80 text-blue-300 border-blue-500/40 icon:Package',
  Shipped: 'bg-purple-950/80 text-purple-300 border-purple-500/40 icon:Truck',
  Delivered: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 icon:CheckCircle',
  Cancelled: 'bg-rose-950/80 text-rose-300 border-rose-500/40 icon:AlertCircle',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersApi();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  if (orders.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl max-w-md mx-auto my-12 space-y-4">
        <Package className="w-16 h-16 text-slate-500 mx-auto stroke-[1.5]" />
        <h2 className="text-2xl font-bold text-white">No orders placed yet</h2>
        <p className="text-slate-400 text-sm">Once you complete checkout, your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Order History</h1>
        <p className="text-slate-400 text-sm mt-1">Track and review your previous purchases</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400">Order ID: #{order._id}</span>
                <p className="text-xs text-slate-400 mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    statusStyles[order.orderStatus] || statusStyles.Pending
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{order.orderStatus}</span>
                </span>
                <span className="text-xl font-extrabold text-white">${Number(order.totalPrice).toFixed(2)}</span>
              </div>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-xl bg-slate-950 shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-slate-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping details footer */}
            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p>
                Shipping Address: <span className="text-slate-300 font-medium">{order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
              </p>
              <p>
                Payment Method: <span className="text-indigo-300 font-semibold">{order.paymentMethod}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
