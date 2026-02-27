"use client";
import Image from "next/image";
import heroImg from "@/public/hero.png";
import { Ubuntu } from "next/font/google";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ubuntu = Ubuntu({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchQuery.trim() !== "") {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <>
            <main className={`flex-1 ${ubuntu.className}`}>
                <div className="relative px-4 lg:px-6">
                    <section className="mt-6 lg:mt-8 rounded-2xl overflow-hidden relative min-h-125 min-w-full flex items-center">
                        <Image
                            src={heroImg}
                            alt="Intense workout athlete lifting heavy weights in gym"
                            fill
                            priority
                            className="object-cover object-right"
                        />

                        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/10"></div>

                        <div className="relative z-10 px-8 text-white space-x-4 max-w-162.5">
                            {/* badge */}
                            <div className="bg-[#ec1313]/20 text-[#ec1313] font-bold py-1.5 px-4 rounded-full max-w-fit mb-6 text-sm uppercase tracking-wider">Premium Products</div>

                            {/* title & para */}
                            <div className="space-y-3">
                                <h1 className="text-5xl lg:text-7xl font-extrabold capitalize leading-tight">
                                    fuel your <br />
                                    <span className="text-[#ec1313]">ambition</span>
                                </h1>

                                <p className="text-sm md:text-xl font-medium text-gray-300 max-w-125">Scientifically formulated supplements designed for elite athletes. Push past your limits and recover faster with our premium blends.</p>
                            </div>

                            {/* Action Btn */}
                            <div className="mt-9 md:mt-4 flex flex-wrap gap-4">
                                <Link href={'/shop'} className="bg-[#ec1313] hover:bg-[#c40f0f] text-white font-bold py-2 px-5 md:py-3 md:px-8 rounded-md transition-all duration-300">Shop Now</Link>
                                <Link href={'/sale'} className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-5 md:py-3 md:px-8 rounded-md transition-all duration-300">View Bundles</Link>
                            </div>
                        </div>
                    </section>
                    <div className="absolute -bottom-13 left-[9%] md:left-[10%] lg:left-[21.5%] shadow-lg inset-shadow-black">
                        <form onSubmit={handleSearch} className="bg-white py-3 px-4 rounded-md w-85 md:w-160 lg:min-w-225 flex items-center">
                            <CiSearch size={35} className="me-4" />
                            <input type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-0 outline-0 focus:border-0 focus:outline-0 w-full text-sm md:text-xl"
                                placeholder="Search Products..." />
                            <button
                                type="submit"
                                className="text-white bg-slate-950 hover:bg-slate-900 py-2 px-4 md:py-3 md:px-8 transition-all duration-300 cursor-pointer rounded-lg">Search</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}