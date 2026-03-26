import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import UserDashboardShell from "@/components/UserDashboardShell";
import { FaShoppingBag, FaClock, FaUser } from "react-icons/fa";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    
    // Protect the route: If no session or email, send to login
    if (!session || !session.user?.email) {
        redirect("/login");
    }

    await connectDB();
    
    // 1. Fetch the true MongoDB user by email to guarantee we have the correct ObjectId
    const dbUser = await User.findOne({ email: session.user.email }).select("_id");

    if (!dbUser) {
        return (
            <UserDashboardShell>
                <div className="p-8 text-center text-slate-500">
                    User account not found. Please log out and log back in.
                </div>
            </UserDashboardShell>
        );
    }

    // 2. Safely use the MongoDB ObjectId to fetch basic stats
    const orderCount = await Order.countDocuments({ user: dbUser._id });
    const recentOrders = await Order.find({ user: dbUser._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

    return (
        <UserDashboardShell>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                    Welcome back, <span className="text-[#ec1313]">{session.user?.name}</span>
                </h1>
                <p className="text-slate-500 font-medium">Manage your orders and account settings from here.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-red-50 text-[#ec1313] rounded-xl flex items-center justify-center mb-4">
                        <FaShoppingBag />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{orderCount}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Orders</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <FaUser />
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{session.user?.email}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Account Email</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-4">
                        <FaClock />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Elite Member</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Status</p>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-black text-slate-900 uppercase tracking-tight">Recent Orders</h2>
                    <a href="/dashboard/orders" className="text-xs font-bold text-[#ec1313] hover:underline uppercase tracking-widest cursor-pointer">View All</a>
                </div>
                
                <div className="p-2">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium text-sm">
                            No orders placed yet.
                        </div>
                    ) : (
                        recentOrders.map((order: any) => (
                            <div key={order._id.toString()} className="p-4 hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                                        #{order._id.toString().slice(-4).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            ${(order.totalAmount || 0).toFixed(2)}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 rounded-full text-slate-600 group-hover:bg-red-50 group-hover:text-[#ec1313] transition-colors">
                                    {order.status || 'Processing'}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </UserDashboardShell>
    );
}