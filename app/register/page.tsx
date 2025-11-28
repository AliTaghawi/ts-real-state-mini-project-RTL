import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RegisterPage from "@/templates/RegisterPage";
import { authOptions } from "@/api/auth/config";

export const dynamic = 'force-dynamic';

async function Register() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/")
  return <RegisterPage />;
}

export default Register;
