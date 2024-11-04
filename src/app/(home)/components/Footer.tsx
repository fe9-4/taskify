import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="mt-[120px] flex w-full flex-col items-center md:mt-[160px] md:h-[100px] md:flex-row md:justify-between xl:px-[100px]">
      <p className="text-xs text-gray02 md:text-lg">©codeit - 2024</p>
      <div className="my-3 flex gap-5">
        <p className="text-xs text-gray02 md:text-lg">Privacy Policy</p>
        <p className="text-xs text-gray02 md:text-lg">FAQ</p>
      </div>
      <div className="mb-[90px] mt-14 flex w-[92px] items-center justify-between md:my-0">
        <HiMail className="size-[18px] text-white md:size-5 xl:size-[22px]" />
        <FaFacebookSquare className="size-[18px] text-white md:size-5 xl:size-[22px]" />
        <FaInstagram className="size-[18px] text-white md:size-5 xl:size-[22px]" />
      </div>
    </footer>
  );
};

export default Footer;
