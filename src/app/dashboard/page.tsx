import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardPath } from "@/lib/rbac";

/**
 * Main dashboard page - redirects by role
 */
export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const path = getDashboardPath(session.user.role);
    redirect(path);
}
