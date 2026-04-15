import React from 'react';
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';
import { HiOutlineShieldCheck } from 'react-icons/hi2';

const features = [
  {
    icon: <HiShoppingBag className="text-2xl" />,
    title: 'Free Shipping',
    desc: 'On all prepaid orders',
    color: 'bg-lv-gold',
  },
  {
    icon: <HiArrowPathRoundedSquare className="text-2xl" />,
    title: '3 Days Return',
    desc: 'Easy return & exchange',
    color: 'bg-lv-gold',
  },
  {
    icon: <HiOutlineShieldCheck className="text-2xl" />,
    title: 'Secure Payments',
    desc: '100% secure checkout',
    color: 'bg-lv-gold',
  },
  {
    icon: <HiOutlineCreditCard className="text-2xl" />,
    title: 'COD Available',
    desc: 'Cash on delivery option',
    color: 'bg-lv-gold',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.3em] uppercase text-lv-gold mb-2">Why Choose Us</p>
          <h2 className="font-serif text-2xl md:text-4xl text-lv-dark tracking-wide">The Louis Veil Promise</h2>
          <div className="w-10 h-[1px] bg-lv-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 md:justify-center py-3 md:py-4 md:border-r last:border-r-0 border-gray-100"
            >
              <div className={`${f.color} w-10 h-10 rounded-full flex items-center justify-center text-black flex-shrink-0`}>
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{f.title}</p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;