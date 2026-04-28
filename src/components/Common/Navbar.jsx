import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const navLinks = [
  { to: "/collections/all?gender=Men", label: "Men" },
  { to: "/collections/all?gender=Women", label: "Women" },
  { to: "/collections/all", label: "Collections" },
  { to: "/thrift", label: "Thrift" },
  { to: "/community", label: "Community" },
];

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHasScrolled(currentY > 20);
      if (currentY < 60) {
        setNavVisible(true);
      } else if (currentY < lastScrollY.current) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setNavVisible(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navDrawerOpen]);

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  const isTransparent = isHome && !hasScrolled;
  const iconColor = isTransparent ? 'text-white' : 'text-lv-dark';

  return (
    <>
      {/* Spacer for fixed navbar on non-home pages */}
      {!isHome && <div className="h-[110px] md:h-[120px]" />}

      {/* ── Fixed wrapper ── */}
      <div
        className={`fixed left-0 right-0 z-50 transition-transform duration-500 ease-out ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ top: 0 }}
      >
        {/* ── Luxury promo ribbon ── */}
        <div className="text-center text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.12em] md:tracking-[0.25em] uppercase py-2 px-2 whitespace-nowrap select-none bg-lv-dark text-lv-gold">
          Complimentary shipping on orders above ₹999 &nbsp;·&nbsp; Easy 15-day returns
        </div>

        {/* ── Main navbar ── */}
        <nav className={`w-full transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-lv-cream/95 backdrop-blur-md border-b border-lv-gold/10 shadow-sm'
        }`}>
          {/* Top row: Logo centered, icons on sides */}
          <div className="max-w-[1440px] mx-auto px-5 md:px-10">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Left: Profile + Admin */}
              <div className="flex items-center gap-2 flex-1">
                <Link
                  to={user ? "/profile" : "/login"}
                  className={`p-2 transition-opacity hover:opacity-60 ${iconColor}`}
                  aria-label={user ? "Go to profile" : "Go to login"}
                >
                  <HiOutlineUser className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                {user && user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`hidden md:inline-flex items-center text-[10px] font-medium uppercase tracking-[0.15em] px-3 py-1 border transition-colors ${
                      isTransparent
                        ? 'border-white/40 text-white hover:bg-white/10'
                        : 'border-lv-dark/30 text-lv-dark hover:bg-lv-dark hover:text-white'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>

              {/* Center: Brand */}
              <Link to="/" className="flex-shrink-0 text-center group">
                <span className={`lv-logo-animate font-serif text-2xl md:text-3xl font-light tracking-[0.08em] transition-all duration-500 group-hover:tracking-[0.14em] ${
                  isTransparent ? 'text-white' : 'text-lv-dark'
                }`}>
                  LOUIS VEIL
                </span>
              </Link>

              {/* Right: Icons */}
              <div className="flex items-center justify-end gap-1.5 md:gap-2.5 flex-1">
                <Link to="/wishlist" className={`p-2 transition-opacity hover:opacity-60 hidden md:flex ${iconColor}`}>
                  <HiOutlineHeart className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <button onClick={toggleCartDrawer} className={`relative p-2 transition-opacity hover:opacity-60 ${iconColor}`}>
                  <HiOutlineShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-600 text-white text-[9px] font-medium rounded-full leading-none px-0.5">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <button onClick={toggleNavDrawer} className={`p-1.5 md:hidden transition-opacity hover:opacity-60 ${iconColor}`}>
                  <HiBars3BottomRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Bottom row: Desktop nav links — centered, with gold underline */}
            <div className="hidden md:flex items-center justify-center gap-0 pb-2.5 -mt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`relative px-5 py-1 text-[11.5px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 group ${
                    isTransparent ? 'text-white/80 hover:text-white' : 'text-lv-dark hover:text-lv-gold'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-5 right-5 h-[1px] transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100 ${
                    isTransparent ? 'bg-white' : 'bg-lv-gold'
                  }`} />
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${
          navDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleNavDrawer}
      />

      {/* ── Luxury mobile drawer ── */}
      <div
        className={`fixed top-0 right-0 w-[320px] max-w-[88vw] h-full bg-white z-50 transform transition-transform duration-400 ease-out md:hidden ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <span className="font-serif text-lg font-bold tracking-[0.06em] text-lv-dark">LOUIS VEIL</span>
          <button onClick={toggleNavDrawer} className="p-2 hover:opacity-60 transition-opacity">
            <IoMdClose className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="py-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={toggleNavDrawer}
              className="block px-8 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gray-600 hover:text-lv-dark hover:bg-lv-cream/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer divider with gold accent */}
        <div className="mx-8 h-px bg-gradient-to-r from-transparent via-lv-gold/40 to-transparent" />

        {/* Drawer secondary */}
        <div className="py-5 px-8 space-y-3">
          <Link to="/wishlist" onClick={toggleNavDrawer} className="flex items-center gap-3 text-[12px] uppercase tracking-[0.15em] text-gray-500 hover:text-lv-dark py-1.5 transition-colors">
            <HiOutlineHeart className="h-4 w-4" /> Wishlist
          </Link>
          <Link to="/profile" onClick={toggleNavDrawer} className="flex items-center gap-3 text-[12px] uppercase tracking-[0.15em] text-gray-500 hover:text-lv-dark py-1.5 transition-colors">
            <HiOutlineUser className="h-4 w-4" /> My Account
          </Link>
          {user && user.role === "admin" && (
            <Link to="/admin" onClick={toggleNavDrawer} className="flex items-center gap-3 text-[12px] uppercase tracking-[0.15em] text-gray-500 hover:text-lv-dark py-1.5 transition-colors">
              <span className="w-4 h-4 flex items-center justify-center text-[10px]">⚙</span> Admin
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
