import Link from "next/link";
import { FaSearch, FaArrowRight } from "react-icons/fa";

export default function DashboardNotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                <FaSearch size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Record Not Found</h1>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                We couldn't find the dashboard page you were looking for.
            </p>
            <Link 
                href="/dashboard/orders" 
                className="bg-[#ec1313] hover:bg-[#c40f0f] text-white px-8 py-3 rounded-lg font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-red-500/20"
            >
                View My Orders <FaArrowRight />
            </Link>
        </div>
    );
}