import { signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import TextInput from "@/elements/TextInput";
import { RootState } from "@/redux/stor";
import { closeDeletePopup } from "@/redux/features/displays/displaysSlice";

const initialValues = {
  password: "",
};

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "مرز عبور باید 8 کارکتر یا بیشتر باشد")
    .required("الزامی!"),
});

const onSubmit = async (values: object) => {
  const result = await fetch("/api/user", {
    method: "DELETE",
    body: JSON.stringify(values),
  });
  const res = await result.json();
  if (res.error) {
    toast.error(res.error);
  } else if (res.message) {
    signOut();
  }
};

const DeletePopup = () => {
  // const ref = useRef(null);
  const dispatch = useDispatch();
  const isOpen = useSelector((stor: RootState) => stor.displays.deletePopup);
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  // useOutsideClick(ref, () => {
  //   dispatch(closeDeletePopup());
  // });

  const cancelHandler = () => {
    dispatch(closeDeletePopup());
    formik.resetForm();
  };

  return (
    <div
      className={`mb-[50%] ${
        isOpen ? "block" : "hidden"
      } fixed top-0 left-0 z-20 w-full h-full backdrop-blur-xs px-2`}
    >
      <form
        // ref={ref}
        onSubmit={formik.handleSubmit}
        className="bg-white dark:bg-gray-950 p-4 border-2 border-red-400 dark:border-red-900 rounded-xl block w-fit mt-[150px] mx-auto"
      >
        <p>از رفتن شما بسیار متاسفیم. </p>
        <p>اگر از حذف حساب کاربری خود مطمئنید، رمز عبور خود را وارد کنید.</p>
        <TextInput
          title=""
          type="password"
          name="password"
          placeholder="رمز عبور"
          value={formik.values.password}
          error={formik.errors.password}
          blur={formik.touched.password}
          changeHandler={formik.handleChange}
          blurHandler={formik.handleBlur}
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-400/85 dark:border dark:border-red-300 dark:bg-red-950 dark:hover:bg-red-900/80 py-0.5 px-1.5 text-white dark:text-red-300 rounded-md flex items-center"
          >
            <MdDeleteForever className="text-xl" />
            حذف حساب کاربری
          </button>
          <button
            type="button"
            onClick={cancelHandler}
            className="bg-emerald-500 hover:bg-emerald-500/85 dark:border dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950 dark:hover:bg-emerald-900 py-0.5 px-2.5 text-white rounded-md"
          >
            انصراف
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default DeletePopup;
