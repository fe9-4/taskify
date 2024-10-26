import Link from "next/link";
import Image from "next/image";
import { useWidth } from "@/hooks/useWidth";

interface LogoProps {
  isHomePage: boolean;
}

export const Logo: React.FC<LogoProps> = ({ isHomePage }) => {
  const { isLargeScreen } = useWidth();

  if (!isHomePage) return null;

  return (
    <div className="flex items-center space-x-2">
      <Link href="/" className="flex items-center">
        <div className="relative flex-shrink-0">
          <Image
            src="/images/header/logo_home.svg"
            alt="logo"
            width={24}
            height={30}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        {isLargeScreen && (
          <span
            className="font-montserrat text-lg font-semibold text-white"
            style={{ width: "80px", height: "22px", lineHeight: "28px" }}
          >
            Taskify
          </span>
        )}
      </Link>
    </div>
  );
};
