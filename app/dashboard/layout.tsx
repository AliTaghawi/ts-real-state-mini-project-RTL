import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { ChildrenType } from "@/types/types";

const Layout = async ({ children }: ChildrenType) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
