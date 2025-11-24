import { MdLocationPin } from "react-icons/md";
import { SiHomepage } from "react-icons/si";
import { FaPhone } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { categoryIcons, categoryText, fileTypesText } from "@/utils/constants";
import { FrontFileType } from "@/models/RSFile";
import { e2p, sp } from "@/utils/replaceNumber";
import ShareButton from "@/elements/ShareButton";
import AdminFileActions from "@/elements/fileDetails/AdminFileActions";

const titleStyle = "font-bold border-b-2 border-gray-400 mb-3 pb-3";
const boxStyle = "shadow-[0px_4px_10px] shadow-sky-950/40 rounded-lg p-2.5 flex flex-col items-center mb-4";

const FileDetailsPage = ({ file, isAdmin = false }: { file: FrontFileType; isAdmin?: boolean }) => {
  return (
    <div className="sm:flex sm:gap-8 items-start">
      <div className="w-full sm:w-[calc(100%-250px-2rem)]">
        <div>
          <h2 className="font-bold text-lg mb-1 mt-4">{file.title}</h2>
          <div className="flex items-center gap-0.5">
            <MdLocationPin className="text-sky-500 text-xl" />
            <span className="text-sm">{file.location}</span>
          </div>
        </div>
        <div className="my-8">
          <h3 className={titleStyle}>توضیحات</h3>
          <p>{file.description}</p>
        </div>
        <div className="my-8">
          <h3 className={titleStyle}>امکانات</h3>
          {file.amenities.length ? (
            <ul className="list-disc ps-4">
              {file.amenities.map((item: any) => (
                <li key={item} className="marker:text-sky-500 my-1.5">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p>هیچ موردی ثبت نشده است!</p>
          )}
        </div>
        <div className="my-8">
          <h3 className={titleStyle}>قوانین</h3>
          {file.rules.length ? (
            <ul className="list-disc ps-4">
              {file.rules.map((item: any) => (
                <li key={item} className="marker:text-sky-500 my-1.5">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p>هیچ موردی ثبت نشده است!</p>
          )}
        </div>
      </div>
      <div className="w-[250px]">
        {isAdmin && (
          <AdminFileActions fileId={file._id.toString()} currentStatus={file.published} />
        )}
        <div className={boxStyle}>
          <div className="p-2 rounded-full bg-sky-500">
            <SiHomepage className="text-white" />
          </div>
          <span className="text-sm font-semibold mt-3">{file.realState}</span>
          <div className="flex gap-1 items-center mt-2.5 text-gray-500 font-medium ">
            <FaPhone />
            <span className="">{e2p(file.phone)}</span>
          </div>
        </div>
        <div className={boxStyle}>
          <ShareButton />
        </div>
        <div className={`${boxStyle} text-neutral-700 dark:text-neutral-400`}>
          <div className="flex items-center gap-1.5 mb-3">
            {categoryIcons[file.category]}
            <span>{categoryText[file.category]}</span>
          </div>
          <span className="font-semibold mb-1">
            {fileTypesText[file.fileType]}
          </span>
          <div>
            {typeof file.price === "number" ? (
              <span>{sp(file.price)} تومان</span>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <div>
                  <span className="font-semibold text-sm me-1.5">رهن:</span>
                  <span>{sp(file.price.mortgage)} تومان</span>
                </div>
                <div>
                  <span className="font-semibold text-sm me-1.5">اجاره:</span>
                  <span>{sp(file.price.rent)} تومان</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center mt-3">
            <FaRegCalendarCheck className="text-sky-500" />
            <span>{file.constructionDate.toLocaleDateString("fa-ir")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsPage;
