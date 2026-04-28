import React from 'react';
import { Link } from 'react-router-dom';
import categoryTops from '../../assets/Shop by category/Shop by category/Tops.jpg';
import categoryBottoms from '../../assets/Shop by category/Shop by category/Bottoms.jpg';
import categorySaree from '../../assets/Shop by category/Shop by category/Saree.jpg';
import categoryLehenga from '../../assets/Shop by category/Shop by category/Lehenga.jpg';
import categoryWesternDresses from '../../assets/Shop by category/Shop by category/Western Dresses.jpg';
import categoryCoords from '../../assets/Shop by category/Shop by category/Co-ords.jpg';

const categories = [
  {
    label: 'Tops',
    queryValue: 'Top Wear',
    image: categoryTops,
  },
  {
    label: 'Bottoms',
    queryValue: 'Bottom Wear',
    image: categoryBottoms,
  },
  {
    label: 'Saree',
    queryValue: 'Saree',
    image: categorySaree,
  },
  {
    label: 'Lehenga',
    queryValue: 'Lehenga',
    image: categoryLehenga,
  },
  {
    label: 'Western Dresses',
    queryValue: 'Western Dresses',
    image: categoryWesternDresses,
  },
  {
    label: 'Co-ords',
    queryValue: 'Co-ords',
    image: categoryCoords,
  },
];

const CategoriesSection = () => {
  return (
    <section className="bg-lv-cream/40 py-10 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-7">
          <p className="text-xs tracking-[0.3em] uppercase text-lv-gold mb-2">Categories</p>
          <h2 className="font-serif text-2xl md:text-4xl text-lv-dark tracking-wide">Shop by Category</h2>
          <div className="w-10 h-[1px] bg-lv-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {categories.map((category) => (
            <Link
              key={category.label}
              to={`/collections/all?category=${encodeURIComponent(category.queryValue)}`}
              className="group relative block overflow-hidden border border-lv-dark/10 bg-white"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={`${category.label} category`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="font-serif text-lg md:text-2xl text-white tracking-wide">{category.label}</p>
                <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-lv-gold mt-1">Explore</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
