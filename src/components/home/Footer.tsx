import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="flex w-full flex-col items-center md:h-[6.25rem] md:flex-row md:justify-between xl:px-[6.125rem]">
      <p className="my-3 text-xs text-gray02 md:my-0 md:text-lg">©codeit - 2023</p>
      <div className="flex gap-5">
        <p className="text-xs text-gray02 md:text-lg">Privacy Policy</p>
        <p className="text-xs text-gray02 md:text-lg">FAQ</p>
      </div>
      <div className="my-20 flex w-[5.75rem] items-center justify-between md:my-0">
        <HiMail className="size-[1.125rem] text-white md:size-5 xl:size-[1.375rem]" />
        <FaFacebookSquare className="size-[1.125rem] text-white md:size-5 xl:size-[1.375rem]" />
        <FaInstagram className="size-[1.125rem] text-white md:size-5 xl:size-[1.375rem]" />
      </div>
    </footer>
  );
};

export default Footer;
