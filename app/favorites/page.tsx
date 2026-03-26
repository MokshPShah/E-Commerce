"use client";

import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleFavorite } from "@/store/favoriteSlice";
import { addToCart } from "@/store/cartSlice";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaHeartBroken } from "react-icons/fa";
import toast from "react-hot-toast";

export default function FavoritesPage() {
    const dispatch = useDispatch();
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);

    const handleRemove = (item: any) => {
        dispatch(toggleFavorite(item));
        toast.success(`${item.name} removed from favorites`);
    };

    const handleMoveToCart = (item: any) => {
        // Defaulting to 1 quantity. If flavors are required, you might want to prompt the user or pick a default.
        dispatch(addToCart({ ...item, quantity: 1, flavor: "Standard" }));
        dispatch(toggleFavorite(item)); // Optional: Remove from favorites once added to cart
        toast.success(`${item.name} moved to cart!`);
    };

    if (favoriteItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 pt-14 lg:pt-20 pb-24">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6 shadow-inner">
                    <FaHeartBroken size={40} />
                </div>
                <h1 className="text-4xl font-black text-slate-950 italic uppercase tracking-tighter mb-4">
                    Your Wishlist is Empty
                </h1>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
                    You haven't saved any supplements yet. Explore our store and heart the products you want to fuel your next workout.
                </p>
                <Link 
                    href="/shop" 
                    className="flex items-center gap-2 bg-[#ec1313] hover:bg-[#c40f0f] text-white px-8 py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-red-500/20 active:scale-95 cursor-pointer"
                >
                    <FaArrowLeft /> Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 pt-14 lg:pt-20 pb-24">
            <div className="max-w-7xl mx-auto pt-10">
                <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-950 italic uppercase tracking-tighter">
                            Your Favorites
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">
                            {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'} saved for later.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favoriteItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                            
                            {/* Image Container */}
                            <Link href={`/product/${item.slug}`} className="relative aspect-square bg-gray-100 block cursor-pointer overflow-hidden">
                                {item.image ? (
                                    <Image 
                                        src={item.image} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-xs">
                                        No Image
                                    </div>
                                )}
                            </Link>

                            {/* Product Details */}
                            <div className="p-6 flex flex-col flex-grow">
                                <Link href={`/product/${item.slug}`} className="cursor-pointer">
                                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 hover:text-[#ec1313] transition-colors line-clamp-2">
                                        {item.name}
                                    </h3>
                                </Link>
                                <p className="text-xl font-bold text-[#ec1313] mt-auto">
                                    ${(item.price || 0).toFixed(2)}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleRemove(item)}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 border border-slate-200 hover:border-transparent transition-all cursor-pointer"
                                >
                                    <FaTrash size={14} /> Remove
                                </button>
                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#ec1313] hover:bg-[#c40f0f] shadow-md shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
                                >
                                    <FaShoppingCart size={14} /> Add
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}