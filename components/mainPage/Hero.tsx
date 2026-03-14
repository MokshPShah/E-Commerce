import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
    return (
        <section className="relative h-[100dvh] min-h-[600px] max-h-[900px] flex items-center bg-slate-950 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/hero.png" 
                    alt="Athlete pushing the limits" 
                    fill 
                    className="object-cover object-top opacity-60 md:opacity-70"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 md:px-9 mt-10 md:mt-0">
                <div className="max-w-2xl">
                    
                    <span className="inline-block text-[#ec1313] font-black tracking-[0.2em] uppercase mb-4 text-sm md:text-base animate-fade-in-up">
                        Rise. Lift. Repeat.
                    </span>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6 animate-fade-in-up animation-delay-100">
                        Fuel Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Ambition.</span>
                    </h1>
                    
                    <p className="text-slate-300 text-base md:text-lg mb-10 max-w-lg font-medium leading-relaxed animate-fade-in-up animation-delay-200">
                        Clinically-dosed, premium supplements engineered for elite athletes. No proprietary blends. Just pure, raw performance.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
                        <Link 
                            href="/shop" 
                            className="bg-[#ec1313] hover:bg-[#c40f0f] text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-3 group"
                        >
                            Shop All Supplements
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link 
                            href="/shop?category=pre-workout" 
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider transition-colors flex justify-center items-center"
                        >
                            Explore Pre-Workout
                        </Link>
                    </div>

                </div>
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center animate-bounce text-white/50">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-2">Scroll</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
            </div>
        </section>
    );
}