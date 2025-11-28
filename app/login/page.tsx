import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/config";
import LoginPage from "@/templates/LoginPage";

export const dynamic = 'force-dynamic';

async function Login() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  return <LoginPage />;
}

export default Login;
