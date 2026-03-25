import Link from "next/link";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

export default function AdminNotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-[#ec1313]">
                <FaExclamationTriangle size={40} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Panel Not Found</h1>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                The admin page you are looking for doesn't exist or has been moved. 
            </p>
            <Link 
                href="/admin" 
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
            >
                <FaArrowLeft /> Back to Dashboard
            </Link>
        </div>
    );
}