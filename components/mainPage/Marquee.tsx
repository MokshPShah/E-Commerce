import { FaBolt } from "react-icons/fa";

export default function Marquee() {
    const textItems = [
        "FREE EXPRESS SHIPPING OVER ₹4999",
        "100% TRANSPARENT LABELS",
        "NO PROPRIETARY BLENDS",
        "30-DAY MONEY BACK GUARANTEE",
        "CLINICALLY DOSED INGREDIENTS"
    ];

    return (
        <div className="base-section p-0 pt-10">
            <div className="bg-[#ec1313] text-white py-3 overflow-hidden flex relative z-10 shadow-md">
                <div className="animate-scroll flex">
                    {[...Array(2)].map((_, arrayIndex) => (
                        <div className="flex items-center shrink-0" key={arrayIndex}>
                            {textItems.map((text, idx) => (
                                <div className="flex items-center mx-6 md:mx-10 text-xs md:text-sm font-extrabold tracking-widest uppercase" key={idx}>
                                    <FaBolt className="mr-3 text-yellow-300" size={14} />
                                    {text}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}