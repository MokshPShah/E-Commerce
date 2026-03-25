"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaSearch, FaBoxOpen, FaEdit, FaTrash, FaExternalLinkAlt, FaTimes, FaCheck } from "react-icons/fa";

export default function InventoryTable({ initialProducts }: { initialProducts: any[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Inline Stock Editing State
    const [editingStockId, setEditingStockId] = useState<string | null>(null);
    const [newStockValue, setNewStockValue] = useState<number>(0);
    
    // Full Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- DELETE LOGIC ---
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/inventory?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                toast.success("Product deleted permanently");
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            toast.error("An error occurred while deleting");
        }
    };

    // --- FULL EDIT LOGIC (Modal) ---
    const openEditModal = (product: any) => {
        setEditingProduct({ ...product }); // Create a copy so we don't edit live state instantly
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            const res = await fetch("/api/admin/inventory", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    productId: editingProduct._id,
                    name: editingProduct.name,
                    category: editingProduct.category,
                    price: parseFloat(editingProduct.price),
                    stock: parseInt(editingProduct.stock)
                }),
            });

            if (res.ok) {
                // Update local UI
                setProducts(products.map(p => p._id === editingProduct._id ? editingProduct : p));
                toast.success("Product updated successfully");
                setIsEditModalOpen(false);
            } else {
                toast.error("Failed to update product");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    // --- QUICK INLINE STOCK UPDATE ---
    const handleQuickStockSave = async (productId: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch("/api/admin/inventory", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, stock: newStockValue }),
            });

            if (res.ok) {
                setProducts(products.map(p => p._id === productId ? { ...p, stock: newStockValue } : p));
                toast.success("Stock updated");
                setEditingStockId(null);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const getStockDisplay = (product: any) => {
        if (editingStockId === product._id) {
            return (
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        min="0"
                        value={newStockValue}
                        onChange={(e) => setNewStockValue(parseInt(e.target.value) || 0)}
                        className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#ec1313]"
                    />
                    <button onClick={() => handleQuickStockSave(product._id)} disabled={isUpdating} className="text-green-600 hover:text-green-700 p-1 cursor-pointer">
                        <FaCheck size={14} />
                    </button>
                    <button onClick={() => setEditingStockId(null)} disabled={isUpdating} className="text-red-500 hover:text-red-600 p-1 cursor-pointer">
                        <FaTimes size={14} />
                    </button>
                </div>
            );
        }

        let badgeClass = "bg-red-100 text-red-700";
        let label = "Out of Stock";
        
        if (product.stock > 10) { badgeClass = "bg-green-100 text-green-700"; label = `In Stock (${product.stock})`; }
        else if (product.stock > 0) { badgeClass = "bg-orange-100 text-orange-700"; label = `Low Stock (${product.stock})`; }

        return (
            <button 
                onClick={() => { setEditingStockId(product._id); setNewStockValue(product.stock); }}
                className={`${badgeClass} px-2 py-1 rounded text-xs font-bold cursor-pointer hover:opacity-80 border border-transparent hover:border-slate-300`}
                title="Click to quickly edit stock"
            >
                {label}
            </button>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
            
            {/* Search Bar */}
            <div className="p-6 border-b border-slate-100">
                <div className="relative w-full sm:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-slate-400"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock Level</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    <FaBoxOpen size={32} className="mx-auto mb-3 opacity-50" />
                                    <p className="font-bold">No products found.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                                                {product.image ? (
                                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">No Img</span>
                                                )}
                                            </div>
                                            <div className="max-w-[200px]">
                                                <p className="font-bold text-slate-900 truncate">{product.name}</p>
                                                <p className="text-xs text-slate-400 truncate mt-0.5">ID: {product._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {getStockDisplay(product)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3 text-slate-400">
                                            <Link href={`/product/${product.slug}`} target="_blank" title="View in Store" className="hover:text-blue-500 transition-colors cursor-pointer p-2"><FaExternalLinkAlt size={14} /></Link>
                                            <button onClick={() => openEditModal(product)} title="Edit Product" className="hover:text-slate-900 transition-colors cursor-pointer p-2"><FaEdit size={16} /></button>
                                            <button onClick={() => handleDelete(product._id)} title="Delete Product" className="hover:text-red-500 transition-colors cursor-pointer p-2"><FaTrash size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* FULL EDIT MODAL */}
            {isEditModalOpen && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-slate-900 text-lg">Edit Product</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer p-1">
                                <FaTimes size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Product Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-slate-400"
                                />
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Category</label>
                                <input 
                                    type="text" 
                                    required
                                    value={editingProduct.category}
                                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-slate-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Price ($)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        required
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-[#ec1313] focus:outline-none focus:border-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Total Stock</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={editingProduct.stock}
                                        onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isUpdating} className="flex-1 py-3 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-70">
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}