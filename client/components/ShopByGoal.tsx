"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const goalData = [
    {
        id: "muscle",
        title: "Build Muscle",
        tagline: "Maximum Hypertrophy",
        description: "Pack on lean mass with our high-calorie gainers, pure whey isolates, and strength-boosting creatine formulas.",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2000&auto=format&fit=crop", 
        cta: "Shop Muscle Stack",
        color: "bg-slate-900"
    },
    {
        id: "shred",
        title: "Lose Fat",
        tagline: "Shred & Define",
        description: "Accelerate your metabolism and preserve lean muscle with our thermogenics and low-calorie protein blends.",
        image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=2000&auto=format&fit=crop", 
        cta: "Shop Fat Burners",
        color: "bg-[#ec1313]"
    },
    {
        id: "energy",
        title: "Boost Energy",
        tagline: "Unstoppable Endurance",
        description: "Crush your PRs and eliminate fatigue with our clinically dosed pre-workouts and hydration multipliers.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop", 
        cta: "Shop Pre-Workouts",
        color: "bg-amber-500"
    }
];

export default function ShopByGoal() {
    const [activeGoal, setActiveGoal] = useState(goalData[0]);

    return (
        <section className="py-20 px-4 md:px-9 max-w-[1600px] mx-auto">
            
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase">
                    Choose Your <span className="text-[#ec1313]">Goal</span>
                </h2>
                <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto">
                    Don't guess what you need. Select your primary fitness target below and we'll show you the exact supplements required to get there.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-10">
                {goalData.map((goal) => (
                    <button
                        key={goal.id}
                        onClick={() => setActiveGoal(goal)}
                        className={`px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-sm md:text-base transition-all duration-300 border-2 cursor-pointer
                            ${activeGoal.id === goal.id 
                                ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-105" 
                                : "bg-white border-gray-200 text-slate-600 hover:border-slate-400"
                            }`}
                    >
                        {goal.title}
                    </button>
                ))}
            </div>

            <div className="relative w-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl group flex items-end">
                
                <Image 
                    src={activeGoal.image}
                    alt={activeGoal.title}
                    fill
                    className="object-cover transition-all duration-700 ease-in-out"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/1920x1080/1e293b/ffffff?text=Add+Goal+Image" }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500"></div>

                <div className="relative z-10 w-full md:w-1/2 p-8 md:p-16 text-white transform transition-all duration-500 translate-y-0 opacity-100">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4 ${activeGoal.color}`}>
                        {activeGoal.tagline}
                    </span>
                    
                    <h3 key={`title-${activeGoal.id}`} className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">
                        {activeGoal.title}
                    </h3>
                    
                    <p key={`desc-${activeGoal.id}`} className="text-lg md:text-xl text-gray-300 font-medium mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {activeGoal.description}
                    </p>

                    <Link href={`/shop?category=${activeGoal.id}`} className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 rounded-md font-bold transition-all hover:gap-4">
                        {activeGoal.cta} <FaArrowRight />
                    </Link>
                </div>
            </div>

        </section>
    );
}