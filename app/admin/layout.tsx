import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. SECURITY CHECK: Fetch session on the server
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // If they aren't an admin or super admin, kick them back to the homepage
    if (userRole !== "admin" && userRole !== "super admin") {
        redirect("/");
    }

    // 2. Render the responsive client shell
    return (
        <AdminShell 
            userRole={userRole} 
            userName={session?.user?.name || "Admin"}
        >
            {children}
        </AdminShell>
    );
}