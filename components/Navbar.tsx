"use client";

import Link from "next/link";
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    // Check if the user is logged in
    const { data: session, status } = useSession();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-24 bg-white border-b border-slate-100 z-50 flex items-center">
            <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 flex items-center justify-between gap-4 md:gap-8">

                <Link href="/" className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter cursor-pointer">
                    STRENOXA<span className="text-[#ec1313]">.</span>
                </Link>

                <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                    <Link href="/shop" className="text-xs font-bold text-slate-900 hover:text-[#ec1313] transition-colors cursor-pointer uppercase tracking-widest">
                        Shop All
                    </Link>
                    <Link href="/shop?category=protein" className="text-xs font-bold text-slate-500 hover:text-[#ec1313] transition-colors cursor-pointer uppercase tracking-widest">
                        Protein
                    </Link>
                    <Link href="/shop?category=pre-workout" className="text-xs font-bold text-slate-500 hover:text-[#ec1313] transition-colors cursor-pointer uppercase tracking-widest">
                        Pre-Workout
                    </Link>
                    <Link href="/shop?category=creatine" className="text-xs font-bold text-slate-500 hover:text-[#ec1313] transition-colors cursor-pointer uppercase tracking-widest">
                        Creatine
                    </Link>
                    <Link href="/shop?category=apparel" className="text-xs font-bold text-slate-500 hover:text-[#ec1313] transition-colors cursor-pointer uppercase tracking-widest">
                        Apparel
                    </Link>
                </div>

                <div className="flex-grow max-w-md hidden md:block">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search supplements..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-full py-3.5 pl-6 pr-12 focus:outline-none focus:border-[#ec1313] focus:ring-1 focus:ring-[#ec1313] transition-all"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#ec1313] transition-colors cursor-pointer">
                            <FaSearch size={16} />
                        </button>
                    </form>
                </div>

                <div className="flex items-center gap-6">

                    <div className="flex items-center gap-4">
                        {/* Other icons like Cart */}
                        <UserDropdown />
                    </div>

                    <Link href="/cart" className="relative text-slate-900 hover:text-[#ec1313] transition-colors cursor-pointer">
                        <FaShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#ec1313] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

            </div>
        </header>
    );
}