import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import UserDashboardShell from "@/components/UserDashboardShell";
import Link from "next/link";

export default async function UserOrdersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    await connectDB();
    const orders = await Order.find({ user: (session.user as any).id })
        .sort({ createdAt: -1 })
        .lean();

    return (
        <UserDashboardShell>
            <h1 className="text-3xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">
                Order <span className="text-[#ec1313]">History</span>
            </h1>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
                    <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
                    <Link href="/shop" className="text-[#ec1313] font-bold mt-4 inline-block hover:underline">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order: any) => (
                        <div key={order._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase">Order #{order._id.toString().slice(-6)}</p>
                                <p className="font-bold text-slate-900 mt-1">{order.items.length} Items • ${order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {order.status}
                                </span>
                                <button className="text-sm font-bold text-slate-400 hover:text-slate-900 cursor-pointer">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </UserDashboardShell>
    );
}