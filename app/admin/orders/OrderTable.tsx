"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaBoxOpen } from "react-icons/fa";

export default function OrderTable({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    // Filter orders based on search bar
    const filteredOrders = orders.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle Status Change via API
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setIsUpdating(orderId);
        
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (res.ok) {
                // Update local UI state
                setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                toast.success(`Order updated to ${newStatus}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(null);
        }
    };

    // Helper for Status Badge Colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return "bg-green-100 text-green-700";
            case 'Shipped': return "bg-purple-100 text-purple-700";
            case 'Processing': return "bg-blue-100 text-blue-700";
            case 'Cancelled': return "bg-red-100 text-red-700";
            default: return "bg-orange-100 text-orange-700"; // Pending
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Table Header & Search */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID, Name, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                    />
                </div>
            </div>

            {/* The Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Order Details</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Items Summary</th>
                            <th className="px-6 py-4 text-right">Total</th>
                            <th className="px-6 py-4 text-center">Status Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    <FaBoxOpen size={32} className="mx-auto mb-3 opacity-50" />
                                    <p className="font-bold">No orders found.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('en-US',{
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{order.customerName}</p>
                                        <p className="text-xs text-slate-500">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium max-w-[200px] truncate">
                                        {order.itemsSummary}
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900 text-right">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Status Dropdown (Fully Interactive with cursor-pointer) */}
                                        <select
                                            disabled={isUpdating === order._id}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`appearance-none text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer border-2 border-transparent hover:border-slate-200 focus:outline-none transition-all ${getStatusColor(order.status)} ${isUpdating === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="Pending" className="text-slate-900 bg-white">Pending</option>
                                            <option value="Processing" className="text-slate-900 bg-white">Processing</option>
                                            <option value="Shipped" className="text-slate-900 bg-white">Shipped</option>
                                            <option value="Delivered" className="text-slate-900 bg-white">Delivered</option>
                                            <option value="Cancelled" className="text-slate-900 bg-white">Cancelled</option>
                                        </select>
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