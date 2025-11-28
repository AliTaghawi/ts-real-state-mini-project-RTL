import AdminDashboard from "@/templates/AdminDashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/config";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { securityLogger } from "@/utils/securityLogger";

export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { tab } = await searchParams;
  
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

  // Log will be handled in AdminDashboard client component to prevent duplicates

  return <AdminDashboard />;
}

