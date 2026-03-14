"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosCart, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

interface ProductProps {
    image: string,
    ratings: number,
    productName: string,
    productDesc: string,
    price: string,
    badge?: string,
    badgeColor?: string,
}

export default function ({ image, ratings, productName, productDesc, price, badge, badgeColor }: ProductProps) {

    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite(!isFavorite)
    }
    return (
        <Link href={'/shop'} className="style-card group items-start text-left p-4 gap-2 w-full">
            <div className="w-full bg-gray-50 rounded-xl aspect-square flex items-center justify-center overflow-hidden mb-2 relative group-hover:bg-gray-100 transition-colors duration-300">
                {badge && (
                    <span className={`absolute top-3 left-3 ${badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider z-10`}>{badge}</span>
                )}
                <button
                    onClick={handleFavorite}
                    className={`absolute bottom-3 right-3 z-20 bg-white p-2 rounded-full shadow-sm transition-all duration-300 
                        ${isFavorite
                            ? 'opacity-100 text-[#ec1313]'
                            : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#ec1313] hover:shadow-md'
                        }`}
                >
                    {isFavorite ? <IoMdHeart size={18} /> : <IoMdHeartEmpty size={18} />}
                </button>
                <Image
                    src={image}
                    alt={productName}
                    width={400}
                    height={400}
                    className="object-contain w-[80%] h-[80%] group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/eeeeee/999999?text=Product+Image" }}></Image>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-gray-500 mt-2">
                <FaStar className="text-amber-400" size={14} />
                <span>{ratings}</span>
                <span className="font-normal text-gray-400 ml-1">(1k+ reviews)</span>
            </div>

            <div className="w-full">
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{productName}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{productDesc}</p>
            </div>

            <div className="w-full flex justify-between items-center mt-3">
                <span className="text-2xl font-extrabold text-slate-900">${price}</span>
                <button className="bg-[#ec1313] hover:bg-[#c40f0f] text-white px-4 py-2 rounded-md font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-1">
                    <IoIosCart size={18} /> Add
                </button>
            </div>
        </Link>
    )
}