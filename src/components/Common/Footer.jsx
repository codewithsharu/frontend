import React, { useState } from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { toast } from 'sonner';
import brandLogo from '../../assets/logo.png';

const footerShopLinks = [
  { to: "/collections/all?gender=Men&category=Top Wear", label: "Men's Top Wear" },
  { to: "/collections/all?gender=Women&category=Top Wear", label: "Women's Top Wear" },
  { to: "/collections/all?gender=Men&category=Bottom Wear", label: "Men's Bottom Wear" },
  { to: "/collections/all?gender=Women&category=Bottom Wear", label: "Women's Bottom Wear" },
  { to: "/thrift", label: "Thrift Collection" },
];

const footerSupportLinks = [
  { to: "/support/terms", label: "Terms & Conditions" },
  { to: "/support/privacy", label: "Privacy Policy" },
  { to: "/support/shipping", label: "Shipping & Delivery" },
  { to: "/support/contact", label: "Contact Us" },
  { to: "/support/cancellation", label: "Cancellation & Refund" },
];

const footerAccountLinks = [
  { to: "/profile", label: "My Account" },
  { to: "/my-orders", label: "Order History" },
  { to: "/wishlist", label: "Wishlist" },
];

const socialLinks = [
  { href: "https://www.facebook.com/share/1AsKxdmEL7/", icon: TbBrandMeta, label: "Facebook" },
  { href: "https://www.instagram.com/louisveil.com_india?igsh=ZXNnaGQ2ZjBkOTZm", icon: IoLogoInstagram, label: "Instagram" },
  { href: "https://www.threads.com/@louisveil.com_india", icon: RiTwitterXLine, label: "Threads" },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Welcome to the Louis Veil family.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-lv-dark text-gray-400">

      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 text-center">
          <h3 className="font-serif text-white text-xl md:text-2xl tracking-[0.05em] mb-2">Stay in the World of Louis Veil</h3>
          <p className="text-gray-500 text-sm tracking-wide mb-6">Be the first to discover new collections, exclusive drops & private offers.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 bg-transparent border border-white/20 text-white text-sm tracking-wide placeholder:text-gray-600 focus:outline-none focus:border-lv-gold/60 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-lv-gold text-lv-dark text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-lv-gold/90 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center gap-3">
                <span className="block h-14 w-14 overflow-hidden rounded-lg">
                  <img src={brandLogo} alt="Louis Veil logo" className="h-full w-full object-cover" />
                </span>
                <span className="font-serif text-white text-xl tracking-[0.06em]">LOUIS VEIL</span>
              </div>
            </Link>
            <p className="text-gray-500 text-[13px] leading-relaxed max-w-[200px]">
              Timeless style, thoughtful curation. Where luxury meets conscious fashion.
            </p>

            {/* Social icons */}
            <div className="flex gap-3.5 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center border border-white/15 text-gray-500 hover:border-lv-gold hover:text-lv-gold transition-all duration-300"
                >
                  <s.icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-[10px] font-medium uppercase tracking-[0.25em] mb-5">Shop</h4>
            <ul className="space-y-2.5">
              {footerShopLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[13px] text-gray-500 hover:text-lv-gold transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-[10px] font-medium uppercase tracking-[0.25em] mb-5">Support</h4>
            <ul className="space-y-2.5">
              {footerSupportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[13px] text-gray-500 hover:text-lv-gold transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white text-[10px] font-medium uppercase tracking-[0.25em] mb-5">Account</h4>
            <ul className="space-y-2.5">
              {footerAccountLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[13px] text-gray-500 hover:text-lv-gold transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-[10px] font-medium uppercase tracking-[0.25em] mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <HiOutlinePhone className="h-3.5 w-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                <a href="tel:+917460935762" className="text-[13px] text-gray-500 hover:text-lv-gold transition-colors">
                  +91 7460935762
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <HiOutlineMail className="h-3.5 w-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                <a href="mailto:louisveil.com@gmail.com" className="text-[13px] text-gray-500 hover:text-lv-gold transition-colors">
                  louisveil.com@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <HiOutlineLocationMarker className="h-3.5 w-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-gray-500">Fatehpur, Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-lv-gold/30 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-gray-600 text-[11px] tracking-[0.1em] uppercase">
          &copy; {new Date().getFullYear()} Louis Veil. All Rights Reserved.
        </p>
        <p className="text-gray-600 text-[11px] tracking-[0.1em] uppercase">
          Nikhil Verma
        </p>
        <div className="flex items-center gap-5 text-[11px] tracking-[0.1em] uppercase text-gray-600">
          <Link to="/support/privacy" className="hover:text-lv-gold transition-colors">Privacy</Link>
          <Link to="/support/terms" className="hover:text-lv-gold transition-colors">Terms</Link>
          <Link to="/support/shipping" className="hover:text-lv-gold transition-colors">Shipping</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
