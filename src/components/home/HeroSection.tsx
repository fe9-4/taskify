import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center">
      <Image
        className="h-auto w-[287px] md:w-[537px] xl:w-[772px]"
        src="/images/landing/landing1.svg"
        alt="image6"
        width={0}
        height={0}
      />
      <h1 className="mb-[100px] mt-[26px] text-center text-[40px] font-bold -tracking-[2px] text-white md:mb-[110px] md:mt-[48px] md:text-[56px] xl:text-[76px]">
        새로운 일정 관리 <br className="md:hidden" />
        <span className="font-montserrat text-[42px] -tracking-[1px] text-violet01 md:text-[70px] xl:text-[90px]">
          Taskify
        </span>
      </h1>
      {/* 임시 버튼 */}
      <button className="mb-[76px] h-[46px] w-[235px] bg-violet01 text-white md:mb-[180px]">로그인하기</button>
    </div>
  );
};

export default HeroSection;
