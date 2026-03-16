"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHeartBroken, FaArrowRight, FaShoppingCart, FaTrash, FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleFavorite } from "@/store/favoriteSlice";
import { addToCart } from "@/store/cartSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    if (favoriteItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#f8f9fa] pt-40 lg:pt-48 pb-24">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <FaHeartBroken className="w-15 h-15 text-red-200" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Your Wishlist is Empty</h1>
                <p className="text-slate-500 mb-8 max-w-md text-center">Save your favorite gear here to easily find and purchase it later.</p>
                <Link href="/shop" className="bg-[#ec1313] hover:bg-[#c40f0f] text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider transition-colors flex items-center gap-3 cursor-pointer">
                    Discover Products <FaArrowRight />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-40 lg:pt-48 pb-24">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                
                <div className="flex items-end gap-4 mb-12 border-b border-slate-200 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
                        Saved Items
                    </h1>
                    <span className="text-xl font-medium text-slate-500 mb-1">
                        ({favoriteItems.length})
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {favoriteItems.map((product) => {
                        const isInCart = cartItems.some(item => item._id === product._id);

                        return (
                            <div key={product._id} className="group flex flex-col relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                                
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(toggleFavorite({
                                            _id: product._id, name: product.name, price: product.price, image: product.image, slug: product.slug
                                        }));
                                        toast('Removed from favorites', { icon: '💔' });
                                    }}
                                    className="absolute top-6 right-6 z-20 bg-white p-2.5 rounded-full shadow-sm hover:scale-110 transition-transform duration-300 text-[#ec1313] cursor-pointer"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>

                                <Link href={`/product/${product.slug}`} className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden mb-5 cursor-pointer border border-slate-100 block">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        fill 
                                        className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out p-8" 
                                    />
                                </Link>

                                <div className="flex flex-col text-left px-1 flex-grow">
                                    <Link href={`/product/${product.slug}`} className="cursor-pointer">
                                        <h3 className="text-base font-black text-slate-900 tracking-tight mb-2 hover:text-[#ec1313] transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-slate-900 font-bold text-lg mb-4 mt-auto">
                                        ${product.price.toFixed(2)}
                                    </p>

                                    {isInCart ? (
                                        <button 
                                            onClick={() => router.push('/cart')}
                                            className="w-full bg-green-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-green-600 transition-colors cursor-pointer"
                                        >
                                            <FaCheck size={14} /> View in Cart
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(addToCart({
                                                    _id: product._id, name: product.name, price: product.price, image: product.image, slug: product.slug, quantity: 1
                                                }));
                                                toast.success(`${product.name} added to cart!`);
                                            }}
                                            className="w-full bg-slate-950 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
                                        >
                                            <FaShoppingCart size={14} /> Move to Cart
                                        </button>
                                    )}
                                </div>
                                
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}