import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'react-feather';

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
            <div className="pt-3 space-y-2">
              <div className="h-3.5 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-3.5 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  const getDiscount = (price, discountPrice) => {
    if (!price || !discountPrice || price <= discountPrice) return null;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {safeProducts.map((product, index) => {
        const productColors = normalizeStringArray(product?.colors);
        const productImage = Array.isArray(product?.images)
          ? product.images?.[0]?.url
          : product?.images?.url || product?.image || '/placeholder.jpg';
        const discount = getDiscount(product.price, product.discountPrice);
        return (
          <Link
            key={product._id || index}
            to={`/product/${product._id}`}
            className="group"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={productImage}
                alt={product.name}
              />

              {/* Rating Badge - bottom left */}
              {product.rating > 0 && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-sm shadow-sm">
                  <Star className="w-3 h-3 text-lv-gold fill-lv-gold" />
                  <span className="text-[12px] font-bold text-gray-800">{product.rating}</span>
                </div>
              )}

              {/* Color Swatches - bottom right (Bewakoof pill style) */}
              {productColors.length > 0 && (
                <div className="absolute bottom-2.5 right-2.5 flex items-center bg-white rounded-full px-1.5 py-1 shadow-sm border border-gray-100">
                  <div className="flex -space-x-0.5">
                    {productColors.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)]"
                        style={{ backgroundColor: String(color || '').toLowerCase() || 'transparent' }}
                      />
                    ))}
                  </div>
                  {productColors.length > 3 && (
                    <span className="text-[9px] font-bold text-gray-500 ml-1">+{productColors.length - 3}</span>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="pt-3 pb-1">
              {/* Brand + Heart */}
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-gray-900 truncate uppercase">
                  {product.brand || 'Louis Veil'}
                </p>
                <Heart className="w-[18px] h-[18px] text-gray-300 group-hover:text-lv-gold transition-colors flex-shrink-0 ml-2" />
              </div>

              {/* Name */}
              <h3 className="text-[13px] text-gray-500 truncate mt-0.5 leading-snug">
                {product.name}
              </h3>

              {/* Price Row */}
              <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[15px] font-extrabold text-gray-900">
                  ₹{product.discountPrice || product.price}
                </span>
                {discount && (
                  <>
                    <span className="text-gray-400 line-through text-[13px]">₹{product.price}</span>
                    <span className="text-lv-gold text-[12px] font-bold">{discount}% OFF</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;