"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaTrash, FaUndo, FaExclamationTriangle } from "react-icons/fa";

export default function BinTable({ initialProducts }: { initialProducts: any[] }) {
    const [products, setProducts] = useState(initialProducts);

    // RESTORE TO INVENTORY
    const handleRestore = async (id: string) => {
        try {
            const res = await fetch("/api/admin/inventory", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id, restore: true }),
            });

            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                toast.success("Product restored to inventory!");
            } else {
                toast.error("Failed to restore product");
            }
        } catch (error) {
            toast.error("Error restoring product");
        }
    };

    // PERMANENTLY DELETE
    const handleHardDelete = async (id: string) => {
        if (!window.confirm("WARNING: This will permanently delete the product. Continue?")) return;

        try {
            const res = await fetch(`/api/admin/inventory?id=${id}&action=hard`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                toast.success("Product permanently deleted");
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Deleted Product</th>
                            <th className="px-6 py-4">Deleted On</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                                    <FaExclamationTriangle size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-bold">The recycle bin is empty.</p>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50 transition-colors opacity-75 hover:opacity-100">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0 grayscale">
                                                {product.image && <Image src={product.image} alt={product.name} fill className="object-cover" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 line-through decoration-red-500">{product.name}</p>
                                                <p className="text-xs text-slate-400">ID: {product._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-500">
                                        {new Date(product.deletedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleRestore(product._id)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                                            >
                                                <FaUndo /> Restore
                                            </button>
                                            <button 
                                                onClick={() => handleHardDelete(product._id)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#ec1313] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                                            >
                                                <FaTrash /> Delete Forever
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}