import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import OrderTable from "./OrderTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    // 1. Security Check
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "admin" && userRole !== "super admin") {
        redirect("/");
    }

    // 2. Fetch Live Orders & Populate Customer Data
    await connectDB();
    const rawOrders = await Order.find()
        .populate({ path: 'user', model: User, select: 'name email' })
        .sort({ createdAt: -1 }) // Newest first
        .lean();

    // 3. Serialize data to pass safely to the Client Component
    const orders = rawOrders.map((order: any) => ({
        _id: order._id.toString(),
        customerName: order.user?.name || "Deleted User",
        customerEmail: order.user?.email || "N/A",
        itemsSummary: `${order.items[0]?.name} ${order.items.length > 1 ? `(+${order.items.length - 1} more)` : ''}`,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString()
    }));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                <p className="text-slate-500 font-medium mt-1">View, track, and update all customer orders in real-time.</p>
            </div>

            {/* Pass the live data to our interactive client table */}
            <OrderTable initialOrders={orders} />
        </div>
    );
}