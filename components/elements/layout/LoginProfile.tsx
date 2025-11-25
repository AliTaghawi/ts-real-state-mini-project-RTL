"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { TbLogin2 } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RootState, AppDispatch } from "@/redux/stor";
import { fetchUser } from "@/redux/features/user/userSlice";

const LoginProfile = () => {
  const session = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((store: RootState) => store.user.user);
  useEffect(() => {
    dispatch(fetchUser());
  }, [session.status]);

  return (
    <>
      {session.status === "authenticated" ? (
        <div className="flex items-center">
          {(user?.role === "ADMIN" || user?.role === "SUBADMIN") ? (
            <Link
              href="/Admin"
              className="text-3xl hover:bg-sky-200 dark:hover:bg-sky-800/50 p-0.5 rounded-sm transition ease-linear"
            >
              <MdAdminPanelSettings />
            </Link>
          ) : null}
          <Link
            href="/dashboard"
            className="text-2xl hover:bg-sky-200 dark:hover:bg-sky-800/50 p-1.5 rounded-sm transition ease-linear"
          >
            <FaRegUserCircle />
          </Link>
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-0.5 px-2 py-0.5 hover:bg-sky-200 dark:hover:bg-sky-800/50 rounded-sm transition-all ease-linear"
        >
          <TbLogin2 className="text-xl" />
          Login
        </Link>
      )}
    </>
  );
};

export default LoginProfile;
