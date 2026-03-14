"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaSpinner } from "react-icons/fa";

export default function Footer() {
    // 1. Setup the state for the full-stack form
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // 2. The submit handler that talks to your Resend/MongoDB API route
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Notice we explicitly set source to "footer" here!
                body: JSON.stringify({ email, source: "footer" }),
            });

            const data = await response.json();

            if (response.ok || data.code) {
                setStatus("success");
                setMessage("Thanks for joining the squad! Check your inbox.");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to connect to server.");
        }
    };

    return (
        <footer className="bg-slate-50 text-gray-900 py-16 px-4 md:px-9 mt-20 border-t-4 border-[#ec1313]">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand Section */}
                <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-slate-950 tracking-tighter">
                        STRENOXA <span className="text-[#ec1313]">.</span>
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed max-w-xs">
                        Premium, scientifically-backed supplements designed to fuel your ambition and push you past your limits.
                    </p>

                    <div className="flex gap-4 pt-2">
                        <Link href='#' className="hover:text-[#ec1313] transition-colors"> <FaInstagram size={24} /> </Link>
                        <Link href='#' className="hover:text-[#ec1313] transition-colors"> <FaFacebook size={24} /> </Link>
                        <Link href='#' className="hover:text-[#ec1313] transition-colors"> <FaTwitter size={24} /> </Link>
                        <Link href='#' className="hover:text-[#ec1313] transition-colors"> <FaYoutube size={24} /> </Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-slate-950 font-bold text-lg mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm font-medium">
                        <li> <Link href={'/shop'} className="hover:text-[#ec1313] transition-colors">Shop All</Link> </li>
                        <li> <Link href={'/about'} className="hover:text-[#ec1313] transition-colors">Our Story</Link> </li>
                        <li> <Link href={'/faq'} className="hover:text-[#ec1313] transition-colors">FAQs</Link> </li>
                        <li> <Link href={'/contact'} className="hover:text-[#ec1313] transition-colors">Contact Us</Link> </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-slate-950 font-bold text-lg mb-4">Categories</h4>
                    <ul className="space-y-2 text-sm font-medium">
                        <li><Link href="/shop?category=protein" className="hover:text-[#ec1313] transition-colors">Whey Protein</Link></li>
                        <li><Link href="/shop?category=pre-workout" className="hover:text-[#ec1313] transition-colors">Pre-Workout</Link></li>
                        <li><Link href="/shop?category=vitamins" className="hover:text-[#ec1313] transition-colors">Vitamins & Health</Link></li>
                        <li><Link href="/shop?category=accessories" className="hover:text-[#ec1313] transition-colors">Gym Accessories</Link></li>
                    </ul>
                </div>

                {/* FULL-STACK NEWSLETTER SECTION */}
                <div>
                    <h4 className="text-slate-950 font-bold text-lg mb-4">Join the Squad</h4>
                    <p className="text-sm text-gray-700 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                    
                    {status === "success" ? (
                        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-sm font-medium animate-fade-in-up">
                            {message}
                        </div>
                    ) : (
                        <form className="flex flex-col gap-2" onSubmit={handleNewsletterSubmit}>
                            <div className="flex w-full">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={status === "loading"}
                                    className="bg-slate-200 border border-slate-300 text-slate-950 px-4 py-2 rounded-l-md w-full focus:outline-none focus:border-[#ec1313] text-sm disabled:opacity-50"
                                />
                                <button 
                                    type="submit" 
                                    disabled={status === "loading"}
                                    className="bg-[#ec1313] hover:bg-[#c40f0f] disabled:bg-red-400 text-white px-4 py-2 rounded-r-md font-bold transition-colors cursor-pointer flex items-center justify-center min-w-[65px]"
                                >
                                    {status === "loading" ? <FaSpinner className="animate-spin" /> : "Join"}
                                </button>
                            </div>
                            {/* Error Message Display */}
                            {status === "error" && (
                                <p className="text-[#ec1313] text-xs font-medium pl-1">{message}</p>
                            )}
                        </form>
                    )}
                </div>

            </div>

            <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-slate-300 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; {new Date().getFullYear()} Strenoxa Supplements. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/privacy-policy" className="hover:text-slate-950 transition-colors">Privacy Policy</Link>
                    <Link href="/terms-of-services" className="hover:text-slate-950 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    )
}