"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaUserShield, FaUser } from "react-icons/fa";

export default function UserTable({ initialUsers, currentUserEmail }: { initialUsers: any[], currentUserEmail?: string | null }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    // Search filter
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle Role Change API Call
    const handleRoleChange = async (userId: string, newRole: string) => {
        setIsUpdating(userId);

        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole }),
            });

            if (res.ok) {
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
                toast.success(`User role updated to ${newRole}`);
            } else {
                toast.error("Failed to update user role");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(null);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        if (role === 'super admin') return "bg-red-100 text-[#ec1313]";
        if (role === 'admin') return "bg-blue-100 text-blue-700";
        return "bg-slate-100 text-slate-700"; // standard user
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Search Bar */}
            <div className="p-6 border-b border-slate-100">
                <div className="relative w-full sm:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search by Name, Email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Account ID</th>
                            <th className="px-6 py-4">User Details</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4 text-center">Role Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                    <FaUserShield size={32} className="mx-auto mb-3 opacity-50" />
                                    <p className="font-bold">No users found.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => {
                                const isSelf = user.email === currentUserEmail;

                                return (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-400 text-xs">
                                            {user._id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 flex items-center gap-2">
                                                        {user.name}
                                                        {isSelf && <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.role === 'super admin' ? (
                                                <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-red-100 text-[#ec1313] cursor-not-allowed border border-red-200" title="Super Admins must be managed directly in the database">
                                                    Super Admin
                                                </span>
                                            ) : (
                                                <select
                                                    disabled={isUpdating === user._id || isSelf}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className={`appearance-none text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer border-2 border-transparent hover:border-slate-200 focus:outline-none transition-all ${getRoleBadgeColor(user.role)} ${isUpdating === user._id || isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <option value="user" className="text-slate-900 bg-white">Standard User</option>
                                                    <option value="admin" className="text-slate-900 bg-white">Admin</option>
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}