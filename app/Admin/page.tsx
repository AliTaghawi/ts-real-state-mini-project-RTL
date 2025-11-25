import AdminDashboard from "@/templates/AdminDashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/config";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = await RSUser.findOne({ email: session.user?.email });
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUBADMIN")) {
    redirect("/dashboard");
  }

  return <AdminDashboard />;
}

