"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaDumbbell, FaFireAlt, FaBolt, FaLeaf, FaGoogle, FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [goal, setGoal] = useState("build-muscle");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                toast.success("Account created! Please log in.");
                router.push("/login");
            } else {
                const data = await res.json();
                toast.error(data.message || "Registration failed");
                setIsLoading(false);
            }
        } catch (error) {
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white pt-24">
            <div className="hidden lg:flex w-1/2 relative bg-slate-900">
                <Image
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop"
                    alt="Fitness Athlete"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
                <div className="absolute bottom-20 left-16 z-20 max-w-lg">
                    <h1 className="text-6xl font-black text-white italic tracking-tighter leading-tight mb-4 uppercase">
                        Push Your <br /><span className="text-[#ec1313]">Limits</span>
                    </h1>
                    <p className="text-slate-300 font-medium text-lg leading-relaxed mb-8">
                        Join the elite community. Get personalized supplement stacks, track your gains, and fuel your performance with science-backed nutrition.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-300"></div>
                            <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-400"></div>
                            <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-500"></div>
                        </div>
                        <span className="text-white font-bold text-sm">+10k athletes already fueled</span>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="flex justify-end mb-12 lg:hidden">
                        <span className="text-sm font-medium text-slate-500">Already have an account? <Link href="/login" className="text-[#ec1313] font-bold cursor-pointer hover:underline">Login</Link></span>
                    </div>

                    <h2 className="text-4xl font-black text-slate-950 italic tracking-tight uppercase mb-2">Create Account</h2>
                    <p className="text-slate-500 font-medium mb-8">Start your transformation journey today.</p>

                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        <div>
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaUser /></div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ec1313] focus:ring-1 focus:ring-[#ec1313] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaEnvelope /></div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g., alex@strenoxa.com"
                                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ec1313] focus:ring-1 focus:ring-[#ec1313] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaLock /></div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ec1313] focus:ring-1 focus:ring-[#ec1313] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 block">Main Fitness Goal</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" onClick={() => setGoal('build-muscle')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${goal === 'build-muscle' ? 'border-[#ec1313] bg-red-50 text-[#ec1313]' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                                    <FaDumbbell className="mb-2 text-lg" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Build Muscle</span>
                                </button>
                                <button type="button" onClick={() => setGoal('fat-loss')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${goal === 'fat-loss' ? 'border-[#ec1313] bg-red-50 text-[#ec1313]' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                                    <FaFireAlt className="mb-2 text-lg" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Fat Loss</span>
                                </button>
                                <button type="button" onClick={() => setGoal('performance')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${goal === 'performance' ? 'border-[#ec1313] bg-red-50 text-[#ec1313]' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                                    <FaBolt className="mb-2 text-lg" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Performance</span>
                                </button>
                                <button type="button" onClick={() => setGoal('wellness')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${goal === 'wellness' ? 'border-[#ec1313] bg-red-50 text-[#ec1313]' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                                    <FaLeaf className="mb-2 text-lg" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Wellness</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-[#ec1313] focus:ring-[#ec1313] cursor-pointer" />
                            <span className="text-xs text-slate-500 font-medium">By creating an account, you agree to our <Link href="#" className="text-[#ec1313] hover:underline cursor-pointer">Terms of Service</Link> and <Link href="#" className="text-[#ec1313] hover:underline cursor-pointer">Privacy Policy</Link>.</span>
                        </div>

                        <button disabled={isLoading} type="submit" className="w-full bg-[#ec1313] hover:bg-[#c40f0f] text-white py-4 rounded-xl font-black italic tracking-widest text-lg transition-all duration-300 shadow-xl shadow-red-500/20 active:scale-[0.98] mt-2 cursor-pointer uppercase disabled:opacity-50">
                            {isLoading ? "Creating..." : "Create Account"}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-grow h-px bg-slate-200"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or Register With</span>
                        <div className="flex-grow h-px bg-slate-200"></div>
                    </div>

                    <div className="flex gap-4">
                        <button type="button" className="flex-grow flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-sm font-bold text-slate-700">
                            <FaGoogle className="text-red-500" /> Google
                        </button>
                        <button type="button" className="flex-grow flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-sm font-bold text-slate-700">
                            <FaFacebook className="text-blue-500" /> Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}