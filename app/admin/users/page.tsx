import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserTable from "./UserTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    // 1. Strict Security Check
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // ONLY Super Admins can access the Users page
    if (userRole !== "super admin") {
        redirect("/admin"); // Kick regular admins back to the main dashboard
    }

    // 2. Fetch all registered users
    await connectDB();
    const rawUsers = await User.find().sort({ createdAt: -1 }).lean();

    // 3. Serialize data for the Client Component
    const users = rawUsers.map((user: any) => ({
        _id: user._id.toString(),
        name: user.name || "Unknown",
        email: user.email,
        role: user.role || "user",
        createdAt: user.createdAt.toISOString()
    }));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                <p className="text-slate-500 font-medium mt-1">View, manage, and assign admin roles to registered accounts.</p>
            </div>

            {/* Pass the live data to our interactive table */}
            <UserTable initialUsers={users} currentUserEmail={session?.user?.email} />
        </div>
    );
}