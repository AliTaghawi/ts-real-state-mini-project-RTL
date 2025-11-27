import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "لطفا ایمیل خود را وارد نمایید",
    "string.email": "لطفا ایمیل معتبر وارد کنید",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "لطفا رمز عبور خود را وارد نمایید",
    "string.min": "رمز عبور باید بیشتر از 8 کارکتر باشد",
  }),
});

const registerSchema = loginSchema.append({
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "تکرار رمز عبور همخوانی ندارد",
  }),
});

const userSchema = Joi.object({
  fullName: Joi.string().allow("").optional(),
  showName: Joi.string().min(3).required().messages({
    "string.empty": "لطفا اسم حساب کاربری تان را کامل کنید",
    "string.min": "نام حساب کاربری باید بیشتر از 2 کارکتر باشد",
  }),
  phone: Joi.string()
    .regex(
      /(((^(\+|00)(98)([- ]?))|^(0))(9\d{2})([- ]?)(\d{3})([- ]?)(\d{4})$)|((^(\+|00)(98)([- ]?))|^(0))([1-9]{2}[0-9]{8})$/
    ) // iran num
    .allow("").optional()
    .messages({
      "string.pattern.base": `شماره تلفن وارد شده صحیح نمی‌باشد`,
    }),
  bio: Joi.string().allow("").optional(),
  showSocials: Joi.object({
    email: Joi.boolean().optional(),
    phone: Joi.boolean().optional(),
  }),
});

const passwordUpdateSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    "string.empty": "لطفا رمز عبور خود را وارد نمایید",
    "string.min": "رمز عبور باید بیشتر از 8 کارکتر باشد",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "لطفا رمز عبور خود را وارد نمایید",
    "string.min": "رمز عبور باید بیشتر از 8 کارکتر باشد",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "تکرار رمز عبور همخوانی ندارد",
  }),
});

const fileValidationSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "string.empty": `لطفا عنوان آگهی را وارد نمایید` }),
  description: Joi.string()
    .required()
    .messages({ "string.empty": `لطفا توضیحات را کامل نمایید` }),
  location: Joi.string()
    .required()
    .messages({ "string.empty": `لطفا موقعیت ملک را وارد نمایید` }),
  address: Joi.string()
    .required()
    .messages({ "string.empty": `لطفا موقعیت ملک را وارد نمایید` }),
  phone: Joi.string()
    .regex(
      /(((^(\+|00)(98)([- ]?))|^(0))(9\d{2})([- ]?)(\d{3})([- ]?)(\d{4})$)|((^(\+|00)(98)([- ]?))|^(0))([1-9]{2}[0-9]{8})$/
    ) // iran num
    .required()
    .messages({
      "string.empty": `لطفا شماره تلفن را وارد نمایید`,
      "string.pattern.base": `شماره تلفن وارد شده صحیح نمی‌باشد`,
    }),
  realState: Joi.string()
    .required()
    .messages({ "string.empty": `لطفا نام بنگاه را وارد نمایید` }),
  constructionDate: Joi.date()
    .required()
    .messages({ "date.empty": `لطفا تاریخ ساخت را وارد نمایید` }),
  fileType: Joi.string()
    .regex(/rent|mortgage|buy/)
    .required()
    .messages({ "string.empty": `لطفا نوع ملک را مشخص کنید` }),
  category: Joi.string()
    .regex(/villa|office|store|apartment|land/)
    .required()
    .messages({ "string.empty": `لطفا نوع ملک را مشخص کنید` }),
  areaMeter: Joi.number().min(10).required().messages({
    "number.base": `متراژ باید با عدد نوشته شود`,
    "number.min": "حداقل متراژ باید 10 متر باشد",
    "number.empty": "لطفا متراژ را وارد نمایید",
  }),
  price: [
    Joi.number().required().messages({
      "number.base": `قیمت باید با عدد نوشته شود`,
      "number.empty": `لطفا قیمت را وارد نمایید`,
    }),
    Joi.object({
      rent: Joi.number().required().messages({
        "number.base": `مقدار کرایه باید با عدد نوشته شود`,
        "number.empty": `لطفا مقدار کرایه را وارد نمایید`,
      }),
      mortgage: Joi.number().required().messages({
        "number.base": `مقدار رهن باید با عدد نوشته شود`,
        "number.empty": `لطفا مقدار رهن را وارد نمایید`,
      }),
    }),
  ],
  rules: Joi.array().items(Joi.string()),
  amenities: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()),
});

export {
  loginSchema,
  registerSchema,
  userSchema,
  passwordUpdateSchema,
  fileValidationSchema,
};
