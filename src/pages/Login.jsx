import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from "react-icons/fi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const guestId = useSelector((state) => state.auth.guestId);
    const cart = useSelector((state) => state.cart.cart);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : redirect, { replace: true });
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : redirect, { replace: true });
            }
        }
    }, [user, cart?.products?.length, guestId, dispatch, navigate, redirect, isCheckoutRedirect]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="min-h-screen bg-lv-cream flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-xl overflow-hidden border border-gray-100">
                    {/* Header with logo */}
                    <div className="bg-lv-dark text-white py-10">
                        <h2 className="lv-logo-animate font-serif text-3xl text-center tracking-[0.15em] font-light">LOUIS VEIL</h2>
                        <div className="lv-logo-line w-10 h-[1px] bg-lv-gold mx-auto mt-3" />
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="font-serif text-2xl text-lv-dark tracking-wide">Welcome Back</h2>
                                <p className="text-gray-500 text-sm tracking-wide">Sign in to your account to continue</p>
                            </div>
                            
                            {error && (
                                <div className="p-4 rounded-lg bg-red-50 text-red-600 flex items-center">
                                    <FiAlertCircle className="mr-2" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <FiMail size={20} />
                                        </div>
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-200 focus:ring-1 focus:ring-lv-gold focus:border-lv-gold transition-all"
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <FiLock size={20} />
                                        </div>
                                        <input 
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-200 focus:ring-1 focus:ring-lv-gold focus:border-lv-gold transition-all"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-lv-dark text-white py-3.5 font-medium tracking-[0.15em] uppercase text-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Sign In
                                        <FiLogIn className="ml-2" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-600">
                                Don't have an account?{' '}
                                <Link 
                                    to={`/register?redirect=${encodeURIComponent(redirect)}`} 
                                    className="text-lv-gold hover:text-lv-dark font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;