import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { FaArrowLeft, FaTrashRestore } from "react-icons/fa";
import BinTable from "./BinTable";

export const dynamic = "force-dynamic";

export default async function RecycleBinPage() {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "admin" && (session?.user as any)?.role !== "super admin") {
        redirect("/");
    }

    // ONLY FETCH DELETED ITEMS
    await connectDB();
    const rawProducts = await Product.find({ isDeleted: true }).sort({ deletedAt: -1 }).lean();

    const deletedProducts = rawProducts.map((product: any) => ({
        _id: product._id.toString(),
        name: product.name,
        category: product.category || "Uncategorized",
        price: product.price,
        image: product.image || product.images?.[0] || "",
        deletedAt: product.deletedAt ? product.deletedAt.toISOString() : new Date().toISOString()
    }));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/inventory" className="text-sm font-bold text-slate-400 hover:text-[#ec1313] transition-colors flex items-center gap-2 mb-4 cursor-pointer w-fit">
                    <FaArrowLeft /> Back to Inventory
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 text-[#ec1313] rounded-xl flex items-center justify-center text-xl">
                        <FaTrashRestore />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recycle Bin</h1>
                        <p className="text-slate-500 font-medium mt-1">Items here will be permanently deleted after 30 days.</p>
                    </div>
                </div>
            </div>

            <BinTable initialProducts={deletedProducts} />
        </div>
    );
}