import Image from "next/image";
import Link from "next/link";
import { useWidth } from "@/hooks/useWidth";
import { cls } from "@/lib/utils";

const Logo = ({ isExpanded }: { isExpanded: boolean }) => {
  const { isLargeScreen } = useWidth();

  return (
    <Link
      href="/"
      className={cls("flex w-full items-center xl:justify-start", isExpanded ? "justify-start" : "justify-center")}
    >
      {isLargeScreen || isExpanded ? (
        <Image
          src="/images/header/logo_md.svg"
          alt="로고"
          width={0}
          height={0}
          className="h-[34px] w-[108px]"
          priority={true}
        />
      ) : (
        <Image
          src="/images/header/logo.svg"
          alt="로고"
          width={0}
          height={0}
          className="h-[28px] w-[24px]"
          priority={true}
        />
      )}
    </Link>
  );
};
export default Logo;
