import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryTable from "./InventoryTable";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "admin" && userRole !== "super admin") redirect("/");

    await connectDB();
    // FETCH ONLY ACTIVE PRODUCTS
    const rawProducts = await Product.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();

    const products = rawProducts.map((product: any) => ({
        _id: product._id.toString(),
        name: product.name,
        category: product.category || "Uncategorized",
        price: product.price,
        stock: product.stock || 0,
        image: product.images?.[0] || "",
        slug: product.slug
    }));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your supplement catalog.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/inventory/bin" className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-2">
                        View Recycle Bin
                    </Link>
                    <Link href='/admin/inventory/new' className="px-6 py-3 bg-[#ec1313] hover:bg-[#c40f0f] text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20 cursor-pointer flex items-center gap-2">
                        + Add New Product
                    </Link>
                </div>
            </div>
            <InventoryTable initialProducts={products} />
        </div>
    );
}