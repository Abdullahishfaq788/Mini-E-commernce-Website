import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProductByIdApi } from '../services/productService';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductByIdApi(id);
        if (res.success) {
          setProduct(res.data);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (!product) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl max-w-md mx-auto my-12 space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-slate-400 text-sm">The product you are looking for might have been removed.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 glass-panel p-6 sm:p-10 rounded-3xl">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              {product.category}
            </span>
          </div>
        </div>

        {/* Details Content */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-slate-400 font-semibold ml-2">(4.9 out of 5 stars)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{product.title}</h1>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-white">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${product.stock > 0 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border-rose-500/30'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed pt-2 border-t border-slate-800/80">
              {product.description}
            </p>
          </div>

          {/* Action & Quantity Controls */}
          <div className="space-y-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-slate-300">Quantity</span>
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 rounded-xl p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart - ${(Number(product.price) * quantity).toFixed(2)}</span>
            </button>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center text-xs text-slate-400">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900/50">
                <Truck className="w-5 h-5 text-indigo-400" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900/50">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Original Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900/50">
                <RotateCcw className="w-5 h-5 text-pink-400" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
