import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors"></div>
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/70 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
          {product.category}
        </span>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/products/${product._id}`}
            className="w-11 h-11 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-indigo-600 hover:scale-110 transition-all shadow-lg"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-indigo-500/30"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-slate-400 ml-1.5 font-medium">(4.9)</span>
          </div>
          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Price</span>
            <span className="text-xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
