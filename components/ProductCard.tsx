"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleFavorite } from "@/store/favoriteSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Or whatever icon library you are using

// Ensure your props match your actual Product type
interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    slug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  
  // 1. Read from Redux to see if this specific product is favorited
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((fav) => fav._id === product._id);

  // 2. Handle the click event
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Crucial: Prevents Next.js <Link> from navigating when clicking the heart
    
    dispatch(toggleFavorite({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0] || "",
      slug: product.slug
    }));
  };

  return (
    <div className="relative group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      
      {/* 3. The Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <FaHeart className="w-5 h-5 text-red-500 transition-transform active:scale-75" />
        ) : (
          <FaRegHeart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors active:scale-75" />
        )}
      </button>

      {/* Product Image & Link */}
      <Link href={`/product/${product.slug}`} className="block cursor-pointer">
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
           {/* Replace with Next.js <Image /> if you are using it */}
          <img 
            src={product.image || product.images?.[0] || "/placeholder.png"} 
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
          <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      
    </div>
  );
}