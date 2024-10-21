import Image from "next/image";

const MainSection = () => {
  return (
    <section className="w-[343px] space-y-[60px] md:w-[684px] md:space-y-[90px] xl:w-[1200px]">
      <section className="grid h-[686px] grid-rows-2 rounded-lg bg-black02 md:h-[972px] xl:h-[600px] xl:grid-cols-2 xl:grid-rows-1">
        <div className="flex-1 py-[60px] text-center md:px-[60px] md:text-left xl:py-[120px]">
          <p className="text-xl text-gray02 md:text-[22px]">Point 1</p>
          <h2 className="my-[60px] text-[36px] font-bold text-white md:my-[100px] md:text-[48px]">
            일의 우선순위를
            <br />
            관리하세요
          </h2>
        </div>
        <div className="flex flex-1 items-end justify-end">
          <Image
            className="h-auto w-[296px] md:w-[520px] xl:w-[594px]"
            src="/images/landing/landing2.svg"
            alt="image6"
            width={0}
            height={0}
          />
        </div>
      </section>
      <section className="grid h-[686px] grid-rows-2 rounded-lg bg-black02 md:h-[972px] xl:h-[600px] xl:grid-cols-2 xl:grid-rows-1">
        <div className="flex-1 py-[60px] text-center md:px-[60px] md:text-left xl:order-2 xl:py-[120px]">
          <p className="text-xl text-gray02 md:text-[22px]">Point 2</p>
          <h2 className="my-[60px] text-[36px] font-bold text-white md:my-[100px] md:text-[48px]">
            해야 할 일을
            <br />
            등록하세요
          </h2>
        </div>
        <div className="flex flex-1 items-end justify-center xl:order-1">
          <Image
            className="h-auto w-[218px] md:w-[360px] xl:w-[436px]"
            src="/images/landing/landing3.svg"
            alt="image6"
            width={0}
            height={0}
          />
        </div>
      </section>
    </section>
  );
};

export default MainSection;
