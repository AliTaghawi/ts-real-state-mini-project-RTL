"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { FrontFileType } from "@/models/RSFile";
import AddFileForm from "@/modules/addFilePage/AddFileForm";

const validationSchema = Yup.object({
  title: Yup.string().required("الزامی!"),
  description: Yup.string().required("الزامی!"),
  location: Yup.string().required("الزامی!"),
  address: Yup.string().required("الزامی!"),
  realState: Yup.string().required("الزامی!"),
  phone: Yup.string()
    .matches(
      /(((^(\+|00)(98)([- ]?))|^(0))(9\d{2})([- ]?)(\d{3})([- ]?)(\d{4})$)|((^(\+|00)(98)([- ]?))|^(0))([1-9]{2}[0-9]{8})$/,
      "شماره تلفن معتبر نیست!"
    )
    .required("الزامی!"),
  fileType: Yup.string().oneOf(["rent", "mortgage", "buy"]).required("الزامی!"),
  areaMeter: Yup.number()
    .min(10, "حداقل متراژ باید 10 متر باشد")
    .required("الزامی!"),
  price: Yup.number()
    .min(1000, "باید بیشتر از هزار تومان باشد!")
    .when("fileType", {
      is: (val: string) => val !== "rent",
      then: (schema) =>
        schema.typeError("یک عدد وارد کنید").required("قیمت الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),
  rent: Yup.number()
    .min(1000, "باید بیشتر از هزار تومان باشد!")
    .when("fileType", {
      is: "rent",
      then: (schema) =>
        schema
          .typeError("یک عدد وارد کنید")
          .required("مبلغ اجاره ماهانه الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),
  mortgage: Yup.number()
    .min(1000, "باید بیشتر از هزار تومان باشد!")
    .when("fileType", {
      is: "rent",
      then: (schema) =>
        schema.typeError("یک عدد وارد کنید").required("مبلغ رهن الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),
  category: Yup.string()
    .oneOf(["villa", "apartment", "store", "office", "land"])
    .required("الزامی!"),
  constructionDate: Yup.date()
    .max(new Date(), "تاریخ ساخت نمی‌تواند در آینده باشد")
    .required("الزامی!"),
  amenities: Yup.array().of(Yup.string()),
  rules: Yup.array().of(Yup.string()),
});

const EditFilePage = ({ id }: { id: string }) => {
  const [file, setFile] = useState<FrontFileType | null>(null);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    async function getFile() {
      const res = await fetch(`/api/files/${id}`);
      const { file } = await res.json();
      if (active && file) {
        setFile(file);
        setInitialImages(file.images || []);
      }
    }
    getFile();
    return () => {
      active = false;
    };
  }, [id]);

  const initialValues = useMemo(
    () => ({
      title: "",
      description: "",
      location: "",
      address: "",
      realState: "",
      phone: "",
      fileType: "rent",
      areaMeter: 10,
      category: "apartment",
      constructionDate: new Date(),
      amenities: [],
      rules: [],
      images: [],
      ...file,
      price: typeof file?.price === "number" ? file?.price : 1000,
      rent: typeof file?.price === "object" ? file?.price.rent : 1000,
      mortgage: typeof file?.price === "object" ? file?.price.mortgage : 1000,
      images: file?.images || [],
    }),
    [file]
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
    validationSchema,
  });

  async function onSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    const price =
      values.fileType === "rent"
        ? { rent: +values.rent, mortgage: +values.mortgage }
        : +values.price;
    const payload = {
      ...values,
      areaMeter: +values.areaMeter,
      price,
      images: values.images || [],
    };
    delete payload.rent;
    delete payload.mortgage;
    const result = await fetch(`/api/files/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const res = await result.json();
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message);
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
      resetForm();
      // حذف فایل‌های حذف شده از سرور (API route این کار را انجام می‌دهد)
    }
  }

  const cancelHandler = async () => {
    // حذف تصاویر جدیدی که آپلود شده‌اند اما آگهی ثبت نشده
    const currentImages = formik.values.images || [];
    const newUploadedImages = currentImages.filter(
      (img: string) => !initialImages.includes(img)
    );

    // حذف تصاویر جدید از سرور
    for (const imageUrl of newUploadedImages) {
      if (imageUrl && imageUrl.startsWith("/uploads/")) {
        try {
          const filename = imageUrl.replace("/uploads/", "");
          await fetch(`/api/files/upload/${filename}`, {
            method: "DELETE",
          });
        } catch (error) {
          console.error("Error deleting uploaded image:", error);
        }
      }
    }

    formik.resetForm();
    router.back();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-7">فرم ویرایش آگهی</h2>
      <AddFileForm formik={formik} type="edit" cancelHandler={cancelHandler} />
      <Toaster />
    </div>
  );
};

export default EditFilePage;
