"use client";

import '../app/globals.css'
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoIosCart, IoIosMenu, IoIosClose } from "react-icons/io";
import { RiAccountCircle2Line } from "react-icons/ri";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <div className="relative z-50 bg-white shadow-md">
            <div className="px-4 md:px-9 py-3 flex justify-between items-center inset-shadow-black">

                <Link href={'/'} className="flex justify-center items-center gap-2 z-50">
                    <Image src={'/logo.png'} alt="Logo" width={45} height={45} className="rounded-full" />
                    <h1 className="text-xl md:text-2xl font-bold tracking-wide" style={{ fontFamily: "'Bpmf Iansui', sans-serif" }}>Strenoxa</h1>
                </Link>

                {/* --- DESKTOP MENU --- */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link href={'/protein'} className='font-medium hover:text-[#ec1313] transition-colors'>Protein</Link>
                    <Link href={'/pre-workout'} className='font-medium hover:text-[#ec1313] transition-colors'>Pre-Workout</Link>
                    <Link href={'/vitamins'} className='font-medium hover:text-[#ec1313] transition-colors'>Vitamins</Link>
                    <Link href={'/apparel'} className='font-medium hover:text-[#ec1313] transition-colors'>Apparel</Link>
                    <Link href={'/sale'} className='font-medium text-[#ec1313] hover:text-[#c40f0f] transition-colors'>Sale</Link>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div> {/* Divider Line */}

                    <Link href={'/login'} className="bg-[#ec1313] hover:bg-[#c40f0f] text-white flex items-center font-medium gap-2 p-2 px-4 rounded-md transition-all duration-300 shadow-sm"><RiAccountCircle2Line size={20} /> Sign In</Link>
                    <Link href={'/cart'}>
                        <div className="bg-slate-100 p-2 rounded-md hover:bg-slate-200 transition-all duration-300">
                            <IoIosCart size={24} className="text-gray-800" />
                        </div>
                    </Link>
                </div>

                {/* MOBILE BTN */}
                <div className="flex lg:hidden items-center gap-3 z-50">
                    <Link href={'/cart'}>
                        <div className="bg-slate-100 p-2 rounded-md hover:bg-slate-200 transition-all duration-300">
                            <IoIosCart size={22} className="text-gray-800" />
                        </div>
                    </Link>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-gray-800 focus:outline-none cursor-pointer hover:text-slate-600">
                        {isOpen ? <IoIosClose size={32} /> : <IoIosMenu size={32} />}
                    </button>
                </div>
            </div>


            {/* 1. The Dark Background Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(!isOpen)}
            ></div>

            {/* 2. The Sliding Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                {/* Drawer Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <span className="text-xl font-bold tracking-wider text-gray-800">MENU</span>

                </div>

                {/* Drawer Links */}
                <div className="flex flex-col px-6 py-8 gap-6 grow overflow-y-auto">
                    <Link href={'/'} onClick={() => setIsOpen(!isOpen)} className='text-xl font-semibold text-gray-800 hover:text-[#ec1313] flex justify-between items-center'>Home <span className="text-gray-300">→</span></Link>
                    <Link href={'/protein'} onClick={() => setIsOpen(!isOpen)} className='text-xl font-semibold text-gray-800 hover:text-[#ec1313] flex justify-between items-center'>Protein <span className="text-gray-300">→</span></Link>
                    <Link href={'/pre-workout'} onClick={() => setIsOpen(!isOpen)} className='text-xl font-semibold text-gray-800 hover:text-[#ec1313] flex justify-between items-center'>Pre-Workout <span className="text-gray-300">→</span></Link>
                    <Link href={'/vitamins'} onClick={() => setIsOpen(!isOpen)} className='text-xl font-semibold text-gray-800 hover:text-[#ec1313] flex justify-between items-center'>Vitamins <span className="text-gray-300">→</span></Link>
                    <Link href={'/apparel'} onClick={() => setIsOpen(!isOpen)} className='text-xl font-semibold text-gray-800 hover:text-[#ec1313] flex justify-between items-center'>Apparel <span className="text-gray-300">→</span></Link>
                    <Link href={'/sale'} onClick={() => setIsOpen(!isOpen)} className='text-xl font-bold text-[#ec1313] flex justify-between items-center'>Sale <span className="text-red-300">→</span></Link>
                </div>

                {/* Drawer Footer (Sign In / Up) */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                    <Link href={'/login'} onClick={() => setIsOpen(!isOpen)} className="bg-[#ec1313] text-white flex justify-center items-center font-bold gap-2 py-3 rounded-md shadow-md text-lg"><RiAccountCircle2Line size={24} /> Sign In</Link>
                    <Link href={'/signup'} onClick={() => setIsOpen(!isOpen)} className="bg-white border-2 border-gray-200 text-gray-800 flex justify-center items-center font-bold py-3 rounded-md text-lg">Create Account</Link>
                </div>
            </div>
        </div>
    )
}