import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-3xl max-w-lg mx-auto my-12 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
        <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Your cart is feeling light</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-8">
        Looks like you haven't added anything to your shopping cart yet. Explore our latest premium items!
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <span>Explore Products</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default EmptyCart;
