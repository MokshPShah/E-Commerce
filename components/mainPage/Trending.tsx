"use client";
import Link from "next/link"
import { useEffect, useState } from "react";
import { FaShoppingCart, FaSpinner } from "react-icons/fa";
import Image from "next/image";

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    images: string[];
}

export default function Trending() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const res = await fetch('/api/products?trending=true')
                const data = await res.json();

                if (res.ok) {
                    setProducts(data)
                }
            } catch (error) {
                console.error("Failed to fetch products: ", error);
            } finally {
                setLoading(false)
            }
        }

        fetchTrendingProducts();
    }, [])


    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-4 md:px-9">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <span className="text-[#ec1313] font-bold tracking-widest uppercase text-sm mb-2 block">
                            Top Sellers
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter">
                            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Gear.</span>
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="text-slate-900 font-bold uppercase tracking-wider text-sm hover:text-[#ec1313] transition-colors border-b-2 border-slate-900 hover:border-[#ec1313] pb-1"
                    >
                        View Full Shop
                    </Link>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="animate-spin text-[#ec1313]" size={40} />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-slate-500 font-medium">No trending products found. Check back later!</p>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="group flex flex-col">

                                {/* Image Container */}
                                <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden mb-4">
                                    <Image
                                        src={product.images[0] || "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Quick Add Overlay Button */}
                                    <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-full bg-white text-slate-900 font-bold uppercase tracking-wider py-3 rounded-lg shadow-xl hover:bg-[#ec1313] hover:text-white transition-colors flex justify-center items-center gap-2">
                                            <FaShoppingCart /> Quick Add
                                        </button>
                                    </div>
                                </Link>

                                {/* Product Details */}
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                                        {product.category.replace("-", " ")}
                                    </span>
                                    <Link href={`/product/${product.slug}`}>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 hover:text-[#ec1313] transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-[#ec1313] font-bold text-lg">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}