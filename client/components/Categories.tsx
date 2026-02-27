import Link from "next/link"
import { FaDumbbell, FaBolt, FaFlask, FaPills, FaTshirt, FaShoppingBag, } from "react-icons/fa"

const categoriesData = [
    { name: 'Protien', icon: FaDumbbell, href: '/protein' },
    { name: 'Pre-Workout', icon: FaBolt, href: '/pre-workout' },
    { name: 'Creatine', icon: FaFlask, href: '/creatine' },
    { name: 'Vitamins', icon: FaPills, href: '/vitamins' },
    { name: 'Apparel', icon: FaTshirt, href: '/apparel' },
    { name: 'Accessories', icon: FaShoppingBag, href: '/accessories' },
]

export default function Categories() {
    return (
        <>
            <section className="py-12 px-4 md:px-9 mt-24 md:mt-16 max-w-400 mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Top Categories
                    </h2>
                    <Link href="/shop" className="text-[#ec1313] font-bold text-sm md:text-base hover:text-[#c40f0f] transition-colors flex items-center gap-2">
                        See All <span className="text-lg">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categoriesData.map((category, index) => (
                        <Link
                            href={category.href}
                            key={index}
                            // The 'group' class lets us change the icon color when the user hovers over the card
                            className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg hover:border-red-100 transition-all duration-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group"
                        >
                            {/* Icon Circle */}
                            <div className="bg-red-50 text-[#ec1313] p-5 rounded-full group-hover:bg-[#ec1313] group-hover:text-white transition-colors duration-300">
                                <category.icon size={28} />
                            </div>

                            {/* Category Name */}
                            <span className="font-bold text-slate-800 text-sm md:text-base">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    )
}