import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import {
    FaMoneyBillWave, FaUserFriends, FaShoppingBasket, FaChartLine,
    FaClipboardCheck, FaExclamationTriangle, FaTicketAlt, FaDollarSign
} from "react-icons/fa";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // Connect to DB for Server-Side Fetching
    await connectDB();

    if (userRole === "super admin") {
        // 1. Fetch Real Data for Super Admin
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Aggregate Total Revenue
        const revenueData = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        return <SuperAdminView totalUsers={totalUsers} totalOrders={totalOrders} totalRevenue={totalRevenue} />;
    }

    return <AdminView />;
}

// ----------------------------------------------------------------------
// SUPER ADMIN VIEW (Dynamic Data)
// ----------------------------------------------------------------------
function SuperAdminView({ totalUsers, totalOrders, totalRevenue }: { totalUsers: number, totalOrders: number, totalRevenue: number }) {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Analytics Overview</h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">Live production data across all regions.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        Refresh Data
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-[#ec1313] rounded-lg text-sm font-bold text-white shadow-sm cursor-pointer hover:bg-[#c40f0f] transition-colors">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Top Stat Row (Now Dynamic!) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FaMoneyBillWave className="text-red-500" />} iconBg="bg-red-100"
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    sub="+12.5%" subColor="text-green-500" meta="Increased by $14k this month"
                />
                <StatCard
                    icon={<FaUserFriends className="text-blue-500" />} iconBg="bg-blue-100"
                    title="Active Users"
                    value={totalUsers.toLocaleString()}
                    sub="+5.2%" subColor="text-green-500" meta="Total registered accounts"
                />
                <StatCard
                    icon={<FaShoppingBasket className="text-orange-500" />} iconBg="bg-orange-100"
                    title="Total Orders"
                    value={totalOrders.toLocaleString()}
                    sub="+8.1%" subColor="text-green-500" meta="All-time processed"
                />
                <StatCard
                    icon={<FaChartLine className="text-purple-500" />} iconBg="bg-purple-100"
                    title="Conversion Rate"
                    value="3.82%"
                    sub="-2.4%" subColor="text-red-500" meta="vs. 4.06% last month"
                />
            </div>

            {/* Middle Chart Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Sales Revenue</h3>
                        <p className="text-sm text-slate-400 font-medium">Weekly revenue trends</p>
                    </div>
                    {/* Simulated Wave Chart */}
                    <div className="w-full h-40 mt-4 border-b border-slate-100 relative overflow-hidden">
                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full text-red-500 absolute bottom-0">
                            <path d="M0 40 Q 15 20 30 35 T 60 10 T 90 30 L 100 10 L 100 50 L 0 50 Z" fill="#fca5a5" opacity="0.2" />
                            <path d="M0 40 Q 15 20 30 35 T 60 10 T 90 30 L 100 10" fill="transparent" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-900">User Growth</h3>
                            <span className="bg-red-100 text-[#ec1313] text-xs font-bold px-2 py-1 rounded">Real-time</span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">Monthly new registrations</p>
                    </div>
                    {/* Simulated Bar Chart */}
                    <div className="flex items-end justify-between h-40 mt-4 gap-2 border-b border-slate-100 pb-2">
                        {['h-16', 'h-12', 'h-24', 'h-32', 'h-40', 'h-28'].map((h, i) => (
                            <div key={i} className={`w-1/6 bg-red-300 rounded-t-sm ${h}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// ADMIN OPERATIONS VIEW
// ----------------------------------------------------------------------
function AdminView() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Manage real-time logistics and support demand.</p>
            </div>

            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<FaClipboardCheck className="text-blue-500" />} iconBg="bg-blue-100" title="Pending Orders" value="124" sub="+12.4%" subColor="text-green-500" />
                <StatCard icon={<FaExclamationTriangle className="text-red-500" />} iconBg="bg-red-100" title="Low Stock Items" value="18" sub="Critical" subColor="text-red-500 bg-red-50 px-2 rounded" />
                <StatCard icon={<FaTicketAlt className="text-orange-500" />} iconBg="bg-orange-100" title="Open Tickets" value="42" sub="Wait: 4h" subColor="text-slate-500" />
                <StatCard icon={<FaDollarSign className="text-green-500" />} iconBg="bg-green-100" title="Daily Revenue" value="$12,450" sub="+8.2%" subColor="text-green-500" />
            </div>

            {/* Orders & Inventory Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900">Recent Orders</h3>
                        <button className="text-sm font-bold text-[#ec1313] cursor-pointer">View All Orders</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Items</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="h-16">
                                    <td className="font-bold text-slate-900">#ORD-9921</td>
                                    <td className="font-medium text-slate-600">John D.</td>
                                    <td className="text-slate-500">Whey Pro x2, BCAA</td>
                                    <td><span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">PROCESSING</span></td>
                                    <td className="font-bold text-slate-900 text-right">$145.20</td>
                                </tr>
                                <tr className="h-16">
                                    <td className="font-bold text-slate-900">#ORD-9920</td>
                                    <td className="font-medium text-slate-600">Sarah L.</td>
                                    <td className="text-slate-500">Pre-Workout Elite</td>
                                    <td><span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded">SHIPPED</span></td>
                                    <td className="font-bold text-slate-900 text-right">$59.99</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Inventory Alerts</h3>
                    <div className="flex flex-col gap-3">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-slate-900">Optimum Whey</p>
                                <p className="text-xs font-medium text-red-500">Only 3 units left</p>
                            </div>
                            <span className="bg-[#ec1313] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider cursor-pointer">Restock</span>
                        </div>
                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-slate-900">BCAA Blast</p>
                                <p className="text-xs font-medium text-orange-500">12 units left</p>
                            </div>
                            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider cursor-pointer">Monitor</span>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-100 cursor-pointer">View Full Inventory</button>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// REUSABLE COMPONENTS
function StatCard({ icon, iconBg, title, value, sub, subColor, meta }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} text-xl`}>
                    {icon}
                </div>
                {sub && <span className={`text-xs font-bold ${subColor}`}>{sub}</span>}
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900">{value}</h3>
            {meta && <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">{meta}</p>}
        </div>
    );
}