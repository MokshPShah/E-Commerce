"use client";

import Image from "next/image";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart, decreaseQuantity, removeFromCart } from "@/store/cartSlice";

export default function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="h-[100dvh] min-h-[600px] max-h-[900px] flex flex-col items-center justify-center px-4 bg-slate-50">
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Your Cart is Empty</h1>
                <p className="text-slate-500 mb-8 max-w-md text-center">Looks like you haven't added any gear to your cart yet. Time to fuel up.</p>
                <Link href="/shop" className="bg-[#ec1313] hover:bg-[#c40f0f] text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider transition-colors flex items-center gap-3">
                    Start Shopping <FaArrowRight />
                </Link>
            </div>
        );
    }

    // If there are items, show the full cart layout!
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-24">
            <div className="max-w-[1600px] mx-auto px-4 md:px-9">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter mb-10">
                    Your <span className="text-[#ec1313]">Cart.</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* LEFT SIDE: The Cart Items List */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6">

                                {/* Product Image */}
                                <Link href={`/product/${item.slug}`} className="relative w-full sm:w-32 aspect-square bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </Link>

                                {/* Product Info & Controls */}
                                <div className="flex-grow flex flex-col w-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link href={`/product/${item.slug}`}>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight hover:text-[#ec1313] transition-colors">{item.name}</h3>
                                        </Link>
                                        <p className="font-bold text-slate-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => dispatch(decreaseQuantity(item._id))}
                                                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="px-4 font-bold text-slate-900" >{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(addToCart(item))} 
                                                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => dispatch(removeFromCart(item._id))}
                                            className="text-slate-400 hover:text-[#ec1313] transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider cursor-pointer"
                                        >
                                            <FaTrash /> <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 sticky top-32">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6">Order Summary</h2>

                        <div className="flex flex-col gap-4 text-slate-600 font-medium border-b border-slate-100 pb-6 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                {shipping === 0 ? (
                                    <span className="text-[#ec1313] font-bold uppercase tracking-wider text-sm">Free</span>
                                ) : (
                                    <span className="text-slate-900 font-bold">${shipping.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="text-lg font-bold text-slate-900 uppercase tracking-wider">Total</span>
                            <span className="text-4xl font-black text-[#ec1313]">${total.toFixed(2)}</span>
                        </div>

                        <button className="w-full bg-[#ec1313] hover:bg-[#c40f0f] text-white py-4 rounded-lg font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-red-500/30 flex justify-center items-center gap-2 active:scale-95 group cursor-pointer">
                            Secure Checkout <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-6 flex justify-center gap-4 text-slate-400">
                            <FaCcVisa size={32} className="hover:text-slate-600 transition-colors cursor-pointer" />
                            <FaCcMastercard size={32} className="hover:text-slate-600 transition-colors cursor-pointer" />
                            <FaCcPaypal size={32} className="hover:text-slate-600 transition-colors cursor-pointer" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}