"use client";

import Link from "next/link";
import { BiCodeAlt, BiEnvelope, BiLinkExternal } from "react-icons/bi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdDeveloperMode, MdDesignServices, MdCode } from "react-icons/md";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-100px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-400 dark:bg-sky-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 p-6 rounded-full shadow-2xl">
                <MdDeveloperMode className="text-6xl text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            درباره سایت (پروژه رزومه‌ای من)
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            سید علی تقوی - توسعه‌ دهنده Front-end و Full-stack
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* About Me Card */}
          <div className="bg-white dark:bg-gray-800 border-2 border-sky-400 dark:border-sky-800 rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <BiCodeAlt className="text-sky-600 dark:text-sky-400" />
              درباره من
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              من یک توسعه‌دهنده فرانت‌اند با بیش از سه سال تجربه هستم که در حال گسترش مهارت‌های بک‌اند خود برای تبدیل شدن به یک فول‌استک کامل می‌باشم.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              علاقه‌مند به حل چالش‌های فنی، نوشتن کد تمیز و یادگیری مداوم هستم. این پروژه نشان‌دهنده‌ی مسیر یادگیری و پیشرفت من در ترکیب تکنولوژی‌های مدرن است.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              به عنوان یک <strong className="text-sky-600 dark:text-sky-400">برنامه‌نویس</strong>، تمرکز اصلی‌ام روی کدنویسی و معماری بوده و طراحی UI را ساده اما زیبا نگه داشته‌ام تا بیشتر توانایی‌های فنی‌ام دیده شود.
            </p>
          </div>

          {/* Project Details Card */}
          <div className="bg-white dark:bg-gray-800 border-2 border-sky-400 dark:border-sky-800 rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <MdCode className="text-sky-600 dark:text-sky-400" />
              درباره این پروژه
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                این پروژه یک نمونه‌ی فول‌استک مدیریت املاک است که با جدیدترین تکنولوژی‌های وب توسعه داده شده و هدف آن نمایش توانایی‌های من در طراحی و پیاده‌سازی رابط کاربری مدرن، امن و مقیاس‌پذیر است.
              </p>
              
              <p className="leading-relaxed">
                در این پروژه از <strong className="text-sky-600 dark:text-sky-400">Next.js</strong> (App Router)، 
                <strong className="text-sky-600 dark:text-sky-400"> TypeScript</strong>، 
                <strong className="text-sky-600 dark:text-sky-400"> TailwindCSS</strong>، 
                <strong className="text-sky-600 dark:text-sky-400"> Redux Toolkit</strong>، 
                <strong className="text-sky-600 dark:text-sky-400"> NextAuth</strong> و 
                <strong className="text-sky-600 dark:text-sky-400"> MongoDB</strong> استفاده شده تا تجربه‌ای روان و کارآمد برای کاربر فراهم شود.
              </p>

              <div className="bg-sky-50 dark:bg-sky-950/30 border-r-4 border-sky-500 dark:border-sky-600 p-4 rounded-lg mt-4">
                <p className="text-sky-700 dark:text-sky-300 font-semibold mb-2">
                  هدف پروژه:
                </p>
                <p className="leading-relaxed">
                  این پروژه بخشی از مسیر یادگیری و رشد من به سمت Full‑Stack Development است. این پروژه نشان می‌دهد که می‌توانم از ترکیب مهارت‌های فرانت‌اند و بک‌اند برای ساخت یک محصول واقعی استفاده کنم.
                </p>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white dark:bg-gray-800 border-2 border-sky-400 dark:border-sky-800 rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <MdDesignServices className="text-sky-600 dark:text-sky-400" />
              ویژگی‌های کلیدی پروژه
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full flex-shrink-0"></div>
                <p className="leading-relaxed">
                  طراحی <strong className="text-sky-600 dark:text-sky-400">RTL (Right‑to‑Left)</strong> برای پشتیبانی کامل از زبان فارسی
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full flex-shrink-0"></div>
                <p className="leading-relaxed">
                  استفاده از <strong className="text-sky-600 dark:text-sky-400">Next.js v15 (App Router)</strong> برای معماری مدرن و بهینه
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full flex-shrink-0"></div>
                <p className="leading-relaxed">
                  مدیریت وضعیت با <strong className="text-sky-600 dark:text-sky-400">Redux Toolkit</strong> برای داده‌های پویا
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full flex-shrink-0"></div>
                <p className="leading-relaxed">
                  احراز هویت امن با <strong className="text-sky-600 dark:text-sky-400">NextAuth</strong> و رمزنگاری پسوردها با <strong className="text-sky-600 dark:text-sky-400">bcryptjs</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full flex-shrink-0"></div>
                <p className="leading-relaxed">
                  ذخیره‌سازی داده‌ها در <strong className="text-sky-600 dark:text-sky-400">MongoDB/Mongoose</strong> با مدل‌های ساختاریافته
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full flex-shrink-0"></div>
                <p className="leading-relaxed">
                  طراحی واکنش‌گرا و مدرن با <strong className="text-sky-600 dark:text-sky-400">TailwindCSS</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full flex-shrink-0"></div>
                <p className="leading-relaxed">
                  پیاده‌سازی <strong className="text-sky-600 dark:text-sky-400">APIهای RESTful</strong> برای ارتباط بین فرانت‌اند و بک‌اند
                </p>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white dark:bg-gray-800 border-2 border-sky-400 dark:border-sky-800 rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <MdDesignServices className="text-sky-600 dark:text-sky-400" />
              تکنولوژی‌های استفاده شده
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                "Next.js 15",
                "TypeScript",
                "React",
                "MongoDB",
                "NextAuth",
                "Tailwind CSS",
                "Redux Toolkit",
                "Formik & Yup",
                "Resend",
              ].map((tech) => (
                <div
                  key={tech}
                  className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg p-3 text-center"
                >
                  <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white dark:bg-gray-800 border-2 border-sky-400 dark:border-sky-800 rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
              <BiEnvelope className="text-sky-600 dark:text-sky-400" />
              تماس با من
            </h2>
            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:marshaltaghawi@gmail.com"
                className="flex items-center gap-3 p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors group"
              >
                <div className="bg-sky-500 dark:bg-sky-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <BiEnvelope className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">ایمیل</p>
                  <p className="text-sky-600 dark:text-sky-400 font-semibold">
                    marshaltaghawi@gmail.com
                  </p>
                </div>
                <BiLinkExternal className="text-sky-600 dark:text-sky-400" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/AliTaghawi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors group"
              >
                <div className="bg-gray-800 dark:bg-gray-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <FaGithub className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">GitHub</p>
                  <p className="text-sky-600 dark:text-sky-400 font-semibold">
                    github.com/AliTaghawi
                  </p>
                </div>
                <BiLinkExternal className="text-sky-600 dark:text-sky-400" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/feed/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors group"
              >
                <div className="bg-blue-600 dark:bg-blue-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <FaLinkedin className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
                  <p className="text-sky-600 dark:text-sky-400 font-semibold">
                    linkedin.com/in/ali-taghawi
                  </p>
                </div>
                <BiLinkExternal className="text-sky-600 dark:text-sky-400" />
              </a>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

