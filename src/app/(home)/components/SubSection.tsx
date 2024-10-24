import Image from "next/image";

const SubSection = () => {
  return (
    <section className="mt-[90px] w-full max-w-[1200px] space-y-9">
      <h2 className="mb-[42px] text-center text-[22px] font-bold text-white md:mb-[36px] md:text-[28px] xl:text-left">
        생산성을 높이는 다양한 설정 ⚡
      </h2>
      <div className="flex flex-col items-center gap-[40px] md:gap-[48px] xl:flex-row xl:justify-between xl:gap-0">
        <article className="w-[343px] md:w-[378px]">
          <div className="flex h-[236px] items-center justify-center rounded-t-lg bg-black04 px-10 md:h-[260px] md:px-9">
            <Image
              className="h-auto w-[260px] xl:w-[300px]"
              src="/images/landing/landing4.svg"
              alt="image6"
              width={0}
              height={0}
            />
          </div>
          <div className="flex h-[112.5px] flex-col justify-center space-y-4 rounded-b-lg bg-black02 px-8 md:h-[124px]">
            <p className="text-xl font-bold text-white">대시보드 설정</p>
            <p className="text-lg font-medium text-white">대시보드 사진과 이름을 변경할 수 있어요.</p>
          </div>
        </article>
        <article className="w-[343px] md:w-[378px]">
          <div className="flex h-[236px] items-center justify-center rounded-t-lg bg-black04 px-10 md:h-[260px] md:px-9">
            <Image
              className="h-auto w-[260px] xl:w-[300px]"
              src="/images/landing/landing5.svg"
              alt="image6"
              width={0}
              height={0}
            />
          </div>
          <div className="flex h-[112.5px] flex-col justify-center space-y-4 rounded-b-lg bg-black02 px-8 md:h-[124px]">
            <p className="text-xl font-bold text-white">초대</p>
            <p className="text-lg font-medium text-white">새로운 팀원을 초대할 수 있어요.</p>
          </div>
        </article>
        <article className="w-[343px] md:w-[378px]">
          <div className="flex h-[236px] items-center justify-center rounded-t-lg bg-black04 px-10 md:h-[260px] md:px-9">
            <Image
              className="h-auto w-[260px] xl:w-[300px]"
              src="/images/landing/landing6.svg"
              alt="image6"
              width={0}
              height={0}
            />
          </div>
          <div className="flex h-[112.5px] flex-col justify-center space-y-4 rounded-b-lg bg-black02 px-8 md:h-[124px]">
            <p className="text-xl font-bold text-white">구성원</p>
            <p className="text-lg font-medium text-white">구성원을 초대하고 내보낼 수 있어요.</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SubSection;
