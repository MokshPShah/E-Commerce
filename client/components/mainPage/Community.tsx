"use client";

import Image from "next/image";
import { FaInstagram, FaSpinner, FaCopy, FaCheck } from "react-icons/fa";
import { useState } from "react";

export default function Community() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // NEW: State to hold the discount code and copy status
    const [discountCode, setDiscountCode] = useState("");
    const [copied, setCopied] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: "lead_magnet" }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setDiscountCode(data.code); // Store the code from the backend
                setEmail("");
            } else {
                // Even if they are already registered, we can still show them the code!
                if (data.code) {
                    setStatus("success");
                    setDiscountCode(data.code);
                    setEmail("");
                } else {
                    setStatus("error");
                    setErrorMessage(data.error || "Something went wrong.");
                }
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Failed to connect to server.");
        }
    };

    // NEW: Copy to clipboard function
    const handleCopy = () => {
        navigator.clipboard.writeText(discountCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the checkmark after 2 seconds
    };

    return (
        <section className="base-sections my-24 max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">

                {/* LEFT SIDE: The Red CTA Card */}
                <div className="bg-[#ec1313] rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-4 relative z-10">
                        Unlock 15% Off<br />Your First Order
                    </h2>

                    {/* UI toggles based on success status */}
                    {status === "success" ? (
                        <div className="bg-black/20 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative z-10 animate-fade-in-up shadow-inner w-full mt-4">
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Code Unlocked!</h3>
                            <p className="text-red-100 text-sm md:text-base mb-6">Apply this code at checkout to claim your 15% discount:</p>

                            {/* The Copy Code Box */}
                            <div className="flex items-center gap-4 bg-black/50 text-white p-3 md:p-4 rounded-xl border border-red-500/30 w-full max-w-sm justify-between group/copy hover:border-red-400/50 transition-colors">
                                <span className="text-2xl md:text-3xl font-mono font-bold text-white tracking-widest ml-2">{discountCode}</span>
                                <button
                                    onClick={handleCopy}
                                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all active:scale-95"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <FaCheck className="text-green-400" size={20} /> : <FaCopy className="text-white group-hover/copy:text-red-200" size={20} />}
                                </button>
                            </div>
                            {copied && <span className="text-green-400 text-xs font-bold mt-3 uppercase tracking-wider">Copied to clipboard!</span>}
                        </div>
                    ) : (
                        <div className="relative z-10 w-full mt-2">
                            <p className="text-red-100 font-medium mb-8 max-w-md">
                                Enter your email below to instantly receive your 15% discount code, plus exclusive training programs and early access to drops.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-3 w-full" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address..."
                                    required
                                    disabled={status === "loading"}
                                    className="w-full px-6 py-4 rounded-xl bg-white text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-70"
                                />
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="bg-black hover:bg-slate-900 disabled:bg-slate-800 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-colors flex-shrink-0 flex items-center justify-center min-w-[140px]"
                                >
                                    {status === "loading" ? <FaSpinner className="animate-spin" size={20} /> : "Get 15% Off"}
                                </button>
                            </form>
                            {status === "error" && (
                                <p className="text-white bg-black/20 px-3 py-1 rounded mt-3 text-sm inline-block font-medium">
                                    {errorMessage}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: The 2x2 Community Grid (Unchanged) */}
                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">The Squad</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Tag <span className="text-[#ec1313]">#Strenoxa</span> to feature</p>
                        </div>
                        <a href="#" className="text-slate-400 hover:text-[#ec1313] transition-colors pb-1"><FaInstagram size={28} /></a>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden group"><Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop" alt="Athlete" fill className="object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden group mt-4 md:mt-8"><Image src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&auto=format&fit=crop" alt="Gym" fill className="object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden group -mt-4 md:-mt-8"><Image src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop" alt="Prep" fill className="object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden group"><Image src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500&auto=format&fit=crop" alt="Supplements" fill className="object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                    </div>
                </div>

            </div>
        </section>
    );
}