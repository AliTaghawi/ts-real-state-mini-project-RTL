import TextInput from "@/elements/TextInput";
import CategoryList from "@/modules/addFilePage/CategoryList";
import CustomDatePicker from "@/modules/addFilePage/CustomDatePicker";
import FileTypeList from "@/modules/addFilePage/FileTypeList";
import TextList from "@/modules/addFilePage/TextList";
import ImageUpload from "@/elements/addFilePage/ImageUpload";

const buttonStyle =
  "py-1 px-2 mb-12 mt-5 rounded-md border transition ease-linear";

const AddFileForm = ({
  formik,
  type,
  cancelHandler,
}: {
  formik: any;
  type: "edit" | "add";
  cancelHandler?: () => void;
}) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <TextInput
        divClass="w-full max-w-[390px]"
        dir="rtl"
        title="عنوان:"
        placeholder="عنوان آگهی"
        type="text"
        name="title"
        value={formik.values.title}
        blur={formik.touched.title}
        error={formik.errors.title}
        changeHandler={formik.handleChange}
        blurHandler={formik.handleBlur}
      />
      <ImageUpload
        images={formik.values.images || []}
        onChange={(images) => formik.setFieldValue("images", images)}
        error={formik.touched.images && formik.errors.images ? formik.errors.images : undefined}
      />
      <TextInput
        divClass="w-full max-w-[390px]"
        dir="rtl"
        title="توضیحات:"
        placeholder="توضیحات آگهی"
        type="text"
        name="description"
        value={formik.values.description}
        blur={formik.touched.description}
        error={formik.errors.description}
        changeHandler={formik.handleChange}
        blurHandler={formik.handleBlur}
        textarea={true}
      />
      <TextInput
        divClass="w-full max-w-[390px]"
        title="متراژ:"
        placeholder="به عدد"
        type="number"
        name="areaMeter"
        value={formik.values.areaMeter}
        blur={formik.touched.areaMeter}
        error={formik.errors.areaMeter}
        changeHandler={formik.handleChange}
        blurHandler={formik.handleBlur}
      />
      <TextInput
        divClass="w-full max-w-[390px]"
        dir="rtl"
        title="موقعیت:"
        placeholder="مثال: تهران محدوده ستارخان"
        type="text"
        name="location"
        value={formik.values.location}
        blur={formik.touched.location}
        error={formik.errors.location}
        changeHandler={formik.handleChange}
        blurHandler={formik.handleBlur}
      />
      <TextInput
        divClass="w-full max-w-[390px]"
        dir="rtl"
        title="آدرس:"
        placeholder="آدرس کامل"
        type="text"
        name="address"
        value={formik.values.address}
        blur={formik.touched.address}
        error={formik.errors.address}
        changeHandler={formik.handleChange}
        blurHandler={formik.handleBlur}
      />
      <TextInput
        divClass="w-full max-w-[390px]"
        dir="rtl"
        title="بنگاه:"
        placeholder="آگهی شخصی یا نام بنگاه آگهی دهنده"
        type="text"
        name="realState"
        value={formik.values.realState}
        blur={formik.touched.realState}
        error={formik.errors.realState}
        changeHandler={formik.handleChange}
        blurHandler={formik.handleBlur}
      />
      <TextInput
        divClass="w-full max-w-[390px]"
        title="شماره تماس:"
        placeholder="شماره ایران"
        type="text"
        name="phone"
        value={formik.values.phone}
        blur={formik.touched.phone}
        error={formik.errors.phone}
        changeHandler={formik.handleChange}
        blurHandler={formik.handleBlur}
      />
      <FileTypeList formik={formik} />
      {formik.values.fileType === "rent" ? (
        <div className=" flex flex-wrap justify-between min-[410px]:gap-4 w-full max-w-[390px]">
          <TextInput
            divClass="w-full min-[410px]:w-[170px]"
            title="اجاره (تومان):"
            placeholder="به عدد"
            type="number"
            name="rent"
            value={formik.values.rent}
            blur={formik.touched.rent}
            error={formik.errors.rent}
            changeHandler={formik.handleChange}
            blurHandler={formik.handleBlur}
          />
          <TextInput
            divClass="w-full min-[410px]:w-[170px]"
            title="رهن (تومان):"
            placeholder="به عدد"
            type="number"
            name="mortgage"
            value={formik.values.mortgage}
            blur={formik.touched.mortgage}
            error={formik.errors.mortgage}
            changeHandler={formik.handleChange}
            blurHandler={formik.handleBlur}
          />
        </div>
      ) : (
        <TextInput
          divClass="w-full max-w-[390px]"
          title="قیمت (تومان):"
          placeholder="به عدد"
          type="number"
          name="price"
          value={formik.values.price}
          blur={formik.touched.price}
          error={formik.errors.price}
          changeHandler={formik.handleChange}
          blurHandler={formik.handleBlur}
        />
      )}
      <CategoryList formik={formik} />
      <CustomDatePicker formik={formik} />
      <TextList
        title="امکانات رفاهی:"
        value={formik.values.amenities}
        formik={formik}
        field="amenities"
      />
      <TextList
        title="قوانین:"
        value={formik.values.rules}
        formik={formik}
        field="rules"
      />
      {type === "add" ? (
        <button
          type="submit"
          className={`${buttonStyle} border-sky-500 bg-sky-200 hover:bg-sky-300 w-full max-w-[390px] dark:border-sky-500 dark:bg-sky-900 dark:hover:bg-sky-800`}
        >
          ثبت آگهی
        </button>
      ) : (
        <div className="flex justify-between w-full max-w-[470px]">
          <button
            type="submit"
            className={`${buttonStyle} border-sky-500 bg-sky-200 hover:bg-sky-300 dark:border-sky-500 dark:bg-sky-900 dark:hover:bg-sky-800`}
          >
            ویرایش آگهی
          </button>
          <button
            type="button"
            onClick={cancelHandler}
            className={`${buttonStyle} border-neutral-500 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700`}
          >
            انصراف
          </button>
        </div>
      )}
    </form>
  );
};

export default AddFileForm;
