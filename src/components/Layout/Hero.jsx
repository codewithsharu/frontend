import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'react-feather';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    title: 'Elevate Your Style',
    subtitle: 'Summer Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1920&q=80',
    title: 'Timeless Elegance',
    subtitle: 'Urban Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
    title: 'Crafted for You',
    subtitle: 'Spring Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80',
    title: 'Premium Athleisure',
    subtitle: 'Sport Collection',
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentIndex];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1.4s] ease-in-out ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover scale-[1.05]"
            style={{
              animation: i === currentIndex ? 'hero-zoom 8s ease-out forwards' : 'none',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative flex items-center justify-center h-full px-4">
        <div className="text-center max-w-3xl">
          {/* Subtitle pill */}
          <div className="mb-6 inline-flex items-center gap-2 border border-lv-gold/40 bg-black/50 backdrop-blur-md px-6 py-2.5">
            <span className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-lv-gold font-medium">
              {slide.subtitle}
            </span>
          </div>

          {/* Main heading */}
          <h1
            key={currentIndex}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-wide leading-[1.1] mb-8"
            style={{ animation: 'hero-text-up 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
          >
            {slide.title}
          </h1>

          {/* CTA */}
          <Link
            to="/collections/all"
            className="group inline-flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="text-[11px] md:text-xs tracking-[0.25em] uppercase">Shop Now</span>
            <span className="w-8 h-[1px] bg-lv-gold group-hover:w-12 transition-all duration-300" />
            <ArrowRight className="w-4 h-4 text-lv-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-[2px] transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-lv-gold' : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes hero-zoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1); }
        }
        @keyframes hero-text-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;