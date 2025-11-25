import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import RSFile from "@/models/RSFile";
import { notFound } from "next/navigation";
import UserProfilePage from "@/templates/UserProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";

export const dynamic = "force-dynamic";

const UserProfile = async ({ params }: { params: Promise<{ userId: string }> }) => {
  await connectDB();
  const { userId } = await params;

  const user = await RSUser.findById(userId).select("-password").lean();
  if (!user) notFound();

  // Get user's published files
  const files = await RSFile.find({
    userId: userId,
    published: true,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Check if current user is admin
  const session = await getServerSession(authOptions);
  let isAdmin = false;
  let isCurrentUser = false;
  if (session) {
    const currentUser = await RSUser.findOne({ email: session.user?.email });
    isAdmin = currentUser?.role === "ADMIN";
    isCurrentUser = currentUser?._id.toString() === userId;
  }

  return (
    <UserProfilePage
      user={JSON.parse(JSON.stringify(user))}
      files={JSON.parse(JSON.stringify(files))}
      isAdmin={isAdmin}
      isCurrentUser={isCurrentUser}
    />
  );
};

export default UserProfile;

