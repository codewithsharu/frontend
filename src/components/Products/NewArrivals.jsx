import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from 'react-feather';
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

const normalizeProductList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products/new-arrivals`);
        setNewArrivals(normalizeProductList(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 640 ? 170 : 260;
      scrollRef.current.scrollBy({ left: direction === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      updateScrollButtons();
    }

    return () => {
      if (container) container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [newArrivals]);

  const getDiscount = (price, discountPrice) => {
    if (!price || !discountPrice || price <= discountPrice) return null;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      {/* Header */}
      <div className="text-center mb-5 md:mb-8 px-4">
        <p className="text-xs tracking-[0.3em] uppercase text-lv-gold mb-2">Latest Collection</p>
        <h2 className="font-serif text-2xl md:text-4xl text-lv-dark tracking-wide">New Arrivals</h2>
        <div className="w-10 h-[1px] bg-lv-gold mx-auto mt-4" />
      </div>

      {/* Carousel - edge to edge with small padding */}
      <div className="relative px-4 md:px-6">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`hidden md:flex absolute left-0 top-[38%] -translate-y-1/2 w-9 h-9 items-center justify-center bg-white rounded-full z-10 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition ${!canScrollLeft ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-[10px] md:gap-[14px] overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[calc(50%-5px)] sm:w-[calc(33.333%-10px)] md:w-[calc(25%-11px)] lg:w-[calc(20%-12px)] animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100" />
                  <div className="p-2.5 space-y-1.5">
                    <div className="h-3 bg-gray-100 w-1/2" />
                    <div className="h-3 bg-gray-100 w-3/4" />
                    <div className="h-3 bg-gray-100 w-2/3" />
                  </div>
                </div>
              ))
            : newArrivals.map((product) => {
                const discount = getDiscount(product.price, product.discountPrice);
                return (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="flex-shrink-0 w-[calc(50%-5px)] sm:w-[calc(33.333%-10px)] md:w-[calc(25%-11px)] lg:w-[calc(20%-12px)] group border border-gray-300 rounded-sm"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Rating Badge */}
                      {product.rating > 0 && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-sm">
                          <Star className="w-3 h-3 text-lv-gold fill-lv-gold" />
                          <span className="text-[11px] font-bold text-gray-800">{product.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5">
                      {/* Brand + Heart */}
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold text-gray-900 truncate uppercase">
                          {product.brand || 'Louis Veil'}
                        </p>
                        <Heart className="w-4 h-4 text-gray-300 group-hover:text-lv-gold transition-colors flex-shrink-0 ml-1" />
                      </div>
                      {/* Name */}
                      <h3 className="text-[12px] text-gray-500 truncate mt-0.5">
                        {product.name}
                      </h3>
                      {/* Price */}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[13px] font-bold text-gray-900">₹{product.discountPrice || product.price}</span>
                        {discount && (
                          <>
                            <span className="text-gray-400 line-through text-[11px]">₹{product.price}</span>
                            <span className="text-lv-gold text-[11px] font-bold">{discount}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`hidden md:flex absolute right-0 top-[38%] -translate-y-1/2 w-9 h-9 items-center justify-center bg-white rounded-full z-10 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition ${!canScrollRight ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <style>
        {`.scrollbar-hide::-webkit-scrollbar { display: none; }`}
      </style>
    </section>
  );
};

export default NewArrivals;