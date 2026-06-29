import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, ShieldCheck, TrendingUp, Cpu, Shirt, Coffee } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProductsApi } from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getProductsApi({ limit: 4, sort: 'newest' });
        if (res.success) {
          setFeaturedProducts(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-14 lg:p-20 border border-slate-700/50">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-pink-500/20 via-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation E-Commerce Store</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Discover Tech & Modern <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Lifestyle Gear.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Elevate your day-to-day setup with our curated collection of high-fidelity audio, smart devices, and minimalist apparel designed for innovation.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/products"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Shop by Category</h2>
            <p className="text-slate-400 text-sm">Browse our carefully curated departments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/products?category=Electronics"
            className="glass-card rounded-2xl p-6 flex items-center gap-5 group hover:border-indigo-500/50 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">Electronics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Headphones, Keyboards & Devices</p>
            </div>
          </Link>

          <Link
            to="/products?category=Fashion"
            className="glass-card rounded-2xl p-6 flex items-center gap-5 group hover:border-purple-500/50 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Shirt className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Fashion</h3>
              <p className="text-xs text-slate-400 mt-0.5">Backpacks, Hoodies & Accessories</p>
            </div>
          </Link>

          <Link
            to="/products?category=Home%20%26%20Kitchen"
            className="glass-card rounded-2xl p-6 flex items-center gap-5 group hover:border-pink-500/50 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Coffee className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">Home & Kitchen</h3>
              <p className="text-xs text-slate-400 mt-0.5">Coffee Sets & Modern Appliances</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
