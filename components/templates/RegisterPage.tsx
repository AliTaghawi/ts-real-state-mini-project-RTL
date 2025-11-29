"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import LoginRegisterForm from "@/modules/LoginRegisterForm";
import { RegisterType } from "@/types/types";

const initialValues: RegisterType = {
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("لطفا ایمیل معتبر وارد کنید").required("الزامی!"),
  password: Yup.string()
    .min(8, "حداقل کارکتر مجاز 8 کارکتر میباشد")
    .required("الزامی!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "تکرار رمز عبور همخوانی ندارد")
    .required("الزامی!"),
});

const RegisterPage = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  async function onSubmit(
    values: object,
    { resetForm }: { resetForm: () => void }
  ) {
    const result = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    const res = await result.json();
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message);
      resetForm();
      setTimeout(() => {
        router.push("/verify-email");
      }, 500);
    }
  }

  return (
    <>
      <LoginRegisterForm formik={formik} type="register" />
      <Toaster />
    </>
  );
};

export default RegisterPage;
