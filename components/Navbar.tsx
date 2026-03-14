"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Shop All", href: "/shop" },
        { name: "Protein", href: "/shop?category=protein" },
        { name: "Pre-Workout", href: "/shop?category=pre-workout" },
        { name: "Creatine", href: "/shop?category=creatine" },
        { name: "Apparel", href: "/shop?category=apparel" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-0"
                : "bg-white border-b border-transparent py-2"
                }`}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-9">
                <div className="flex items-center justify-between h-20">

                    <Link href="/" className="flex-shrink-0 flex items-center gap-1 group">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter transition-transform group-hover:scale-105">
                            STRENOXA <span className="text-[#ec1313]">.</span>
                        </h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-bold uppercase tracking-wider transition-colors relative group ${link.name === "Shop All" ? "text-[#ec1313]" : "text-slate-700 hover:text-[#ec1313]"
                                    }`}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#ec1313] transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-5 md:gap-6">
                        <Link href="/account" className="text-slate-700 hover:text-[#ec1313] transition-colors hidden sm:block">
                            <FaUser size={20} />
                        </Link>

                        <Link href="/cart" className="text-slate-700 hover:text-[#ec1313] transition-colors relative group">
                            <FaShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-2 -right-2 bg-[#ec1313] text-white text-[10px] font-bold h-[18px] min-w-[18px] px-[4px] rounded-full flex items-center justify-center ring-2 ring-white">
                                {totalCartItems > 99 ? "99+" : totalCartItems}
                            </span>
                        </Link>

                        <button
                            className="md:hidden text-slate-900 hover:text-[#ec1313] transition-colors focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <div
                className={`md:hidden absolute top-[100%] left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col px-6 py-6 space-y-4 bg-slate-50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-lg font-black uppercase tracking-widest transition-colors border-b border-slate-200 pb-3 ${link.name === "Shop All" ? "text-[#ec1313]" : "text-slate-900 hover:text-[#ec1313]"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-black text-slate-900 hover:text-[#ec1313] uppercase tracking-widest transition-colors pt-2 flex items-center gap-3"
                    >
                        <FaUser size={20} className="text-[#ec1313]" /> My Account
                    </Link>
                </div>
            </div>
        </header>
    );
}