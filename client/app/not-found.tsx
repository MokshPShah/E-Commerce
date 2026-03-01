import Link from "next/link";
import { FaDumbbell } from "react-icons/fa";

export default function NotFound() {
    return (
        <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4 text-center bg-white pt-20">
            <div className="relative flex justify-center items-center">
                <h1 className="text-[150px] md:text-[200px] font-extrabold text-gray-100 tracking-tighter leading-none">404</h1>

                <div className="absolute text-[#ec1313] bg-red-50 p-6 rounded-full">
                    <FaDumbbell size={60} />
                </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-2">
                Looks Like you skipped a rep.
            </h2>

            <p className="text-gray-500 mt-4 text-lg max-w-md mx-auto font-medium">
                We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href={"/"} className="bg-[#ec1313] hover:bg-[#c40f0f] text-white font-bold py-3 px-8 rounded-md transition-all duration-300 shadow-md">Back to Home</Link>
                <Link href="/shop" className="bg-white border-2 border-gray-200 hover:border-gray-300 text-slate-800 font-bold py-3 px-8 rounded-md transition-all duration-300">
                    Shop Supplements
                </Link>
            </div>

        </div>
    )
}