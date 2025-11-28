import AdminDashboard from "@/templates/AdminDashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/config";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { securityLogger } from "@/utils/securityLogger";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // Log unauthorized access attempt
    try {
      await securityLogger.logUnauthorizedAccess("/Admin", undefined, undefined, "ADMIN or SUBADMIN");
    } catch (e) {
      // Ignore logging errors
    }
    redirect("/login");
  }

  const user = await RSUser.findOne({ email: session.user?.email });
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUBADMIN")) {
    // Log unauthorized access attempt
    try {
      await securityLogger.logUnauthorizedAccess("/Admin", user?._id.toString(), user?.email, "ADMIN or SUBADMIN");
    } catch (e) {
      // Ignore logging errors
    }
    redirect("/dashboard");
  }

  // Log successful admin panel access
  try {
    await securityLogger.logAdminAction("admin_panel_access", user._id.toString(), user.email);
  } catch (e) {
    // Ignore logging errors
  }

  return <AdminDashboard />;
}

